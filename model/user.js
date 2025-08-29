const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
      },
      password: {
        type: String,
        required: true,
        minlength: 6
      },
      name: {
        type: String,
        required: true,
        trim: true
      },
      college: {
        type: String,
        trim: true
      },
      city: {
        type: String,
        trim: true
      },
      skills: [{
        type: String,
        trim: true
      }],
      projects: [{
        name: String,
        description: String,
        technologies: [String],
        githubUrl: String
      }],
      bio: {
        type: String,
        trim: true,
        maxlength: 500
      },
      profileImage: {
        type: String,
        default: 'default-profile.png'
      },
      techStack: [{
        type: String,
        trim: true
      }],
      hackathonInterests: [{
        type: String,
        trim: true
      }],
      role: {
        type: String,
        enum: ['developer', 'designer', 'product manager', 'other'],
        default: 'developer'
      },
      experience: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
      },
      githubProfile: {
        type: String,
        trim: true
      },
      linkedinProfile: {
        type: String,
        trim: true
      },
      connections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
      messages: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Message',
          default: [],
        },
      ],
      createdAt: {
        type: Date,
        default: Date.now
      }
    }, {
      timestamps: true
    });

    userSchema.methods.getPublicProfile = function() {
        const userObject = this.toObject();
        delete userObject.password;
        delete userObject.connections;
        return userObject;
      };
      
      const User = mongoose.model('User', userSchema);
      
      module.exports = User; 