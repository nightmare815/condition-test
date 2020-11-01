let mqtt = require('mqtt')
var dateTime = require('node-datetime');
let client = {}

export default {
  launch(id, topic, callback) {
    client = mqtt('mqtt://121.40.33.108:15675', {
      connectTimeout:70000, //单位毫秒?
      clientId: id,
      clean: false,
      // keepAlive: 70  //单位秒, 一般心跳时间要比超时时间要短. 默认有60秒的心跳时间
    })
    //连接mqtt服务器
    client.on('connect', (res)=> {
      console.log('连接成功!!!')
      //开始订阅
      client.subscribe(topic, {qos: 1}, err => {
        if(!err) {
          console.log('订阅成功,用户id为:',id)
          console.log('subscribe:', topic)
        } else {
          console.log('订阅失败')
        }
      })
      client.on('packetsend', function (packet) {
        console.log(`${dateTime.create().format('H:M:S')}: send ${packet.cmd}`)
      })

      client.on('packetreceive', function (packet) {
        console.log(`${dateTime.create().format('H:M:S')}: receive ${packet.cmd}`)
      })
    })

    //收到消息后的操作
    client.on('message', (topic, message) => {
      console.log('收到来自订阅主题' + topic + '的消息: ' + message)
      callback(topic, message)
    })
  },

  end() {
    client.end()
  },

  //发布消息
  publish(topic, message) {
    client.publish(topic, JSON.stringify(message), {qos: 1})
  }
}
