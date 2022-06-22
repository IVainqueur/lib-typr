export const wait = (duration)=>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{resolve()}, duration)
    })
}

export const getType = (value)=>{
    return Object.prototype.toString.call(value).slice(1, -1).split(' ')[1]
}

export const randomWait = (min, max)=>{
    return Math.floor(Math.random() * (max-min)) + min
}