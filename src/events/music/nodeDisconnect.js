module.exports = async (client, node) => {
    try {
        console.log(`Node ${node.name} desconectado`)
    } catch (err) {
        await client.errorLogger(client, err, null)
    }
}