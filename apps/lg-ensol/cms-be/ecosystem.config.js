module.exports = {
  apps: [
    {
      name: 'cms-be',
      script: 'npm',
      args: 'start',
      exec_mode: 'cluster',
      instances: 1,
      autorestart: true,
      listen_timeout: 50000,
      kill_timeout: 5000,
    },
  ],
};
