const app = require('./app')
const {info} = require('./utils/logger')
const {port} = require('./utils/config')

app.listen(port, () => {
    info(`Server is running on port ${port}`)
})