import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export interface IUser extends mongoose.Document {
    email: string,
    password: string,
    name: string,
    userType: string,
    resetToken?: string,
    resetTokenExpires?: Date,
    matchPassword: (password: string) => Promise<boolean>,
    getResetToken: () => string
};

export interface IUserModel extends mongoose.Model<IUser> {
    instanceOfIUser: (param: any) => param is IUser
}

const allUserSchema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        trim: true
    },
    name: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        enum: ["Chef", "Rider", "Customer"],
        required: true
    },
    resetToken: {
        type: String,
    },
    resetTokenExpires: {
        type: Date,
    }
}, { timestamps: true })

// pre methods
allUserSchema.pre("save", async function (next: any): Promise<void> {
    if (!this.isModified("password")) {
        return next();
    };
    let salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// methods
allUserSchema.methods.matchPassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

allUserSchema.methods.getResetToken = function (): string {
    let token = crypto.randomBytes(20).toString("hex");
    this.resetToken = crypto.createHash("sha256").update(token).digest("hex");
    this.resetTokenExpires = Date.now() + 10 * 60 * 1000;
    return token;
};

// static methods
allUserSchema.statics.instanceOfIUser = (param: any): param is IUser => {
    return param.name !== undefined
};