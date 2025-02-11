import screenshot from 'screenshot-desktop'
import { WebSocketServer } from 'ws'
import http from 'http'
import getPixels from 'get-pixels'
import fs from 'fs'
import path from 'path'
import robot from 'robotjs'
const createScreenshot = async () => {
    const image = await screenshot({ format: 'png' })
    return {
        base64: image.toString('base64'), //截图受控设备返回base64
        imageBuffer: image //返回buffer流
    }
}

const server = http.createServer()
const wss = new WebSocketServer({ server }) //创建webSocket服务

const getScreenSize = async () => {
    const { imageBuffer, base64 } = await createScreenshot()
    const filePath = path.join(process.cwd(), '/screenshot.png')
    fs.writeFileSync(filePath, imageBuffer) //将图片存入本地 一直替换
    return new Promise((resolve, reject) => {
        getPixels(filePath, (err, pixels) => {
            if (err) reject(err)
                console.log(pixels.shape)
            resolve({
                width: pixels.shape[0], //获取图片宽高
                height: pixels.shape[1], //获取图片宽高
                base64 //返回图片base64
            })
        })
    })
}

wss.on('connection', async (ws) => {
    ws.on('message',(message)=>{
        const data = JSON.parse(message)
        if(data.type === 'click'){ //监听事件
            const x = data.x
            const y = data.y
            robot.moveMouse(x,y) //点击的位置
            robot.mouseClick() //模拟点击事件
        }
    })
    setInterval(async () => {
        const data = await getScreenSize()
        ws.send(JSON.stringify(data))
    },500) //一秒钟发送一次截图
})
server.listen(3000,()=>{
    console.log('server is running on 3000')
})
