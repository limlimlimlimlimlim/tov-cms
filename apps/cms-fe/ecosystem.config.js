module.exports = {
  apps: [
    {
      name: 'cms-fe',
      script: 'npm',
      args: 'start',
      exec_mode: 'cluster',
      instances: 2,
      autorestart: true,
      listen_timeout: 50000,
      kill_timeout: 5000,
    },
  ],
};
