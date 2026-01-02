const { exec } = require('child_process');

console.log('Looking for process on port 5000...');
exec('netstat -ano | findstr :5000', (err, stdout) => {
    if (err) {
        console.log('No process found or error running netstat.');
        return;
    }

    if (stdout) {
        const lines = stdout.trim().split('\n');
        const pids = new Set();

        lines.forEach(line => {
            // Line format: TCP    0.0.0.0:5000           0.0.0.0:0              LISTENING       1234
            const parts = line.trim().split(/\s+/);
            const pid = parts[parts.length - 1];

            // Ensure it's listening on port 5000 specifically
            if (line.includes(':5000') && pid && /^\d+$/.test(pid) && pid !== '0') {
                pids.add(pid);
            }
        });

        if (pids.size === 0) {
            console.log('No PIDs found listening on port 5000.');
            return;
        }

        pids.forEach(pid => {
            console.log(`Killing process with PID: ${pid}`);
            exec(`taskkill /F /PID ${pid}`, (killErr, killStdout, killStderr) => {
                if (killErr) {
                    console.error(`Error killing PID ${pid}: ${killErr.message}`);
                } else {
                    console.log(`Successfully killed PID ${pid}`);
                }
            });
        });
    } else {
        console.log('Port 5000 appears to be free.');
    }
});
