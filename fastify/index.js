import fastify from "fastify"
const app = fastify({
    // logger: true
})

app.register(function (fastify, opts, done) {
    app.decorate(opts.name, (a, b) => a + b)
    const add = fastify[opts.name](1, 2)
    console.log(add)
    done()
}, {
    name: "xxx"
})
app.get('/', (req, res) => {
    res.send('hello world')
})
// 没有.json
//1.给前端返回的值 res.send("字符串"|对象|数组)
//2. 直接return返回值
app.route({
    url: "/add",
    method: "POST",
    // 序列化入参以及出参
    schema: {
        body: {
            type: "object", //要求前窜传入一个对象 {a,b}
            properties: {
                a: {
                    type: "string"
                },
                b: {
                    type: "string"
                }
            },
            required: ["a", "b"]
        },
        response: {
            200: {
                type: "object",
                properties: {
                    message: {
                        type: "string"
                    },
                    data: {
                        type: "array", //是个数组类型
                        items: { //子集
                            type: "object",
                            properties: {
                                name: {
                                    type: "string"
                                },
                                age: {
                                    type: "number"
                                }
                            }

                        }
                    }
                }
            }
        }
    },
    handler: (req, res) => {
        console.log(req, res, "1111111111")
        req.query.page
        return {
            data: [{
                name: "fastify",
                version: "4.27.0"
            }]
        }
    }
})
app.post('/', (req, res) => {
    console.log(req.body)
    // res.send('hello world')
    return "123123"
})
app.listen({
    port: 3000
}).then(() => {
    console.log('server is running on 3000')
})