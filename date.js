
exports.getFullDate = () => {
    return new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    })
}

exports.getDate = () => {
    return new Date().toLocaleDateString('en-US', {
        weekday: 'long'
    })
}