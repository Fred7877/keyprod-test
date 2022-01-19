import {rest} from 'msw'
import ordersFile from './data/orders.json'
import usersFile from './data/users.json'

export default [
    rest.get('/orders', (req, res, ctx) => {
        return res(
            ctx.json(ordersFile)
        )
    }),
    rest.get('/login', (req, res, ctx) => {
        return res(
            ctx.json(usersFile)
        )
    }),
    rest.get('/order', (req, res, ctx) => {
        let result = ordersFile.filter(obj => {
            return obj.number == req.url.searchParams.get('id')
        });

        if (result[0] !== undefined) {
            result = result[0]
        } else {
            result = {};
        }

        return res(
            ctx.json(result)
        )
    })
]