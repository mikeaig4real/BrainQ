# Brain-Q

Brain-Q is a dynamic puzzle and brain-training app designed to challenge cognitive abilities across various categories. Built with modern web technologies like Next.js and cloud services like AWS Amplify, Brain-Q delivers an engaging, gamified learning experience for users of all ages.

## Overview

Brain-Q goes beyond traditional learning apps by incorporating interactive games that test logic, memory, math, reaction time, and more. With its sleek UI, real-time feedback, and category-based progression tracking, Brain-Q helps users sharpen their skills while having fun.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Framer Motion for animations, DaisyUI with Tailwind CSS for styling
- **Backend**: AWS Amplify
- **Authentication**: Amazon Cognito  
- **Database**: Amazon DynamoDB
- **API**: AWS AppSync (GraphQL)
- **Deployment**: AWS Amplify Hosting

## Key Features

- 🔐 **Secure Login**: User authentication with Amazon Cognito
- 🎮 **Brain Games**: Puzzle-based gameplay across logic, math, memory, reaction, visual, and word categories
- 🕹️ **Category Progression**: Dynamic tracking of scores, performance metrics, and skill improvement
- 📊 **Performance Insights**: Real-time score updates and concise performance summaries after each session
- 🌟 **Gamified Experience**: Earn points and track achievements across various categories
- 🔄 **Interactive Animations**: Eye-catching animations powered by Framer Motion
- 📱 **Responsive Design**: Simulated tablet/mobile interface for immersive gameplay

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- AWS Amplify CLI installed (`npm install -g @aws-amplify/cli`)
- An AWS Account

### Installation

```bash
# Clone the repository
git clone https://github.com/mikeaig4real/BrainQ

# Navigate to the project directory
cd BrainQ

# Install dependencies
npm install

# Initialize Amplify (follow prompts to configure your AWS environment) [[1]](https://docs.amplify.aws/nextjs/start/quickstart/)
amplify init

# Deploy Amplify resources
amplify push

# Start the development server
npm run dev
```

## How to Play

1. **Sign Up**: Create an account or log in with your existing credentials, for guest access use (email & password: Guest1234@guest.com)

2. **Navigate to Help menu**: Click on the help menu to see all the how-tos and rules of the game.

3. **Select Single Player**: Navigate back to menu and select single player to start playing the games.


## Contributing
Contributions are welcome! If you have ideas for new features, optimizations, or bug fixes, feel free to fork the repository and submit a pull request.

## Feedback and Support
We'd love to hear your thoughts on Brain-Q! Feel free to open an issue on GitHub or contact us for feedback and suggestions.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.