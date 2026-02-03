module.exports = {
    apps: [
        {
            name: "expa-web",
            script: "node_modules/next/dist/bin/next",
            args: "start -p 3001",
            exec_mode: "fork",
            instances: 1,
            max_memory_restart: "350M",
            node_args: "--max-old-space-size=384",
            env: {
                HOST: "127.0.0.1",
                PORT: "3001",
                NODE_ENV: "production",
            },
        },
    ],
}