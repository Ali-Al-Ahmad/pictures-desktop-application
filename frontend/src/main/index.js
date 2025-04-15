import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import fs from 'fs'
import path from 'path'
import Jimp from 'jimp'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false,
      contextIsolation: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

const savedImagesPath = '../../src/renderer/src/assets/images'
//upload-image-localy
ipcMain.on('save-image', (event, { imageData, imageName }) => {
  const base64Data = imageData.replace(/^data:image\/(jpg|jpeg|png|gif|webp);base64,/, '')
  const filePath = path.join(__dirname, savedImagesPath, imageName)

  fs.writeFile(filePath, base64Data, 'base64', (err) => {
    if (err) {
      console.error('Error saving file:', err)
      event.reply('save-image-response', { success: false, error: err.message })
    } else {
      console.log('File saved successfully:', filePath)
      event.reply('save-image-response', { success: true, path: filePath })
    }
  })
})

//get-image-localy
ipcMain.on('get-images', (event) => {
  const imagesDir = path.join(__dirname, savedImagesPath)

  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error('Error reading images directory:', err)
      event.reply('get-images-response', { success: false, error: err.message })
      return
    }

    const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|gif|webp)$/.test(file))
    const imagePaths = imageFiles.map((file) => path.join('../../../src/assets/images/', file))

    event.reply('get-images-response', { success: true, images: imagePaths })
  })
})

//delete-image-localy
ipcMain.on('delete-image', (event, imageName) => {
  const filePath = path.join(__dirname, savedImagesPath, imageName)

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting file:', err)
      event.reply('delete-image-response', { success: false, error: err.message })
    } else {
      console.log('File deleted successfully:', filePath)
      event.reply('delete-image-response', { success: true })
    }
  })
})

ipcMain.on('edit-image', async (event, { imagePath, bufferBase64, action, options }) => {
  try {
    let image
    let originBuff

    if (bufferBase64) {
      const buffer = Buffer.from(bufferBase64, 'base64')
      image = await Jimp.read(buffer)
    } else if (imagePath) {
      const filePath = path.join(__dirname, savedImagesPath, imagePath)

      image = await Jimp.read(filePath)
      originBuff = await image.getBufferAsync(Jimp.MIME_PNG)
    } else {
      throw new Error('No imagePath or buffer provided')
    }

    switch (action) {
      case 'rotate':
        image.rotate(options?.degrees || -90)
        break

      case 'greyscale':
        image.greyscale()
        break

      case 'crop': {
        const { x, y, width, height } = options
        const croppedImage = image.clone().crop(x, y, width, height)
        const croppedBuffer = await croppedImage.getBufferAsync(Jimp.MIME_PNG)
        const croppedBase64 = `data:image/png;base64,${croppedBuffer.toString('base64')}`

        event.reply('edit-image-response', {
          success: true,
          base64: croppedBase64,
          buffer: croppedBuffer.toString('base64')
        })
        return
      }

      case 'watermark': {
        const watermarkText = options?.text || 'PICSART'
        const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK)
        const opacity = 0.2

        const watermarkLayer = new Jimp(image.bitmap.width, image.bitmap.height, 0x00000000)

        watermarkLayer.print(
          font,
          0,
          0,
          {
            text: watermarkText,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
          },
          image.bitmap.width,
          image.bitmap.height
        )

        watermarkLayer.rotate(-45, false)
        watermarkLayer.opacity(opacity)
        image.composite(watermarkLayer, 0, 0)
        break
      }

      default:
    }
    const buffer = await image.getBufferAsync(Jimp.MIME_PNG)
    const base64 = `data:image/png;base64,${buffer.toString('base64')}`

    event.reply('edit-image-response', {
      success: true,
      base64,
      buffer: buffer.toString('base64'),
      originBuff
    })
  } catch (err) {
    console.error('Edit error:', err)
    event.reply('edit-image-response', {
      success: false,
      err: err.message
    })
  }
})

ipcMain.on('save-edited-image', (event, { imageName, bufferBase64 }) => {
  try {
    const buffer = Buffer.from(bufferBase64, 'base64')
    const savePath = path.join(__dirname, savedImagesPath, imageName)

    fs.writeFileSync(savePath, buffer)

    event.reply('edit-image-response', { success: true })
  } catch (err) {
    console.error('Error saving image:', err)
    event.reply('edit-image-response', { success: false, err: err.message })
  }
})

ipcMain.on('reset-image', (event, { imageName }) => {
  const imagePath = path.join(__dirname, savedImagesPath, imageName)

  try {
    const buffer = fs.readFileSync(imagePath)
    const base64 = `data:image/png;base64,${buffer.toString('base64')}`
    event.reply('reset-image-response', { success: true, base64, buffer })
  } catch (err) {
    console.error('Error reading original image for reset:', err)
    event.reply('reset-image-response', { success: false })
  }
})


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


