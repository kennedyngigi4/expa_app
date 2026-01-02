module.exports = {
    apps: [
        {
            name: "expa-web",
            script: "node_modules/next/dist/bin/next",
            args: "start -p 3000",
            exec_mode: "fork",
            instances: 1,
            max_memory_restart: "350M",
            node_args: "--max-old-space-size=384",
            env: {
                NODE_ENV: "production",
            },
        },
    ],
}