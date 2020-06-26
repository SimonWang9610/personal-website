module.exports = {
    apps: [
        {
            name: 'simonwang.ca',
            script: './app.js',
            instances: 1,
            output: './out.log',
            error: './error.log',
            log_date_format: 'YYYY-MM-DD',
            watch: false,
            exec_mode: 'cluster'
        }
    ]
};