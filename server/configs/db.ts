import mongoose from 'mongoose'

const connectDB = async ()=>{
    try {
        mongoose.connection.on('connected',()=>console.log('MongoDb Connnected'))
        await mongoose.connect(process.env.MONGODB_URI as string)
    } catch (error) {
        console.log('error connecting to DB',error)

    }
}

export default connectDB