document.addEventListener('DOMContentLoaded', () => {
    const processBtn = document.getElementById('process-btn');
    const rawLogInput = document.getElementById('raw-log-input');
    const jsonOutput = document.getElementById('json-output');

    processBtn.addEventListener('click', async () => {
        const rawText = rawLogInput.value.trim();
        
        if (!rawText) {
            jsonOutput.textContent = '// Please paste raw server logs first.';
            jsonOutput.classList.add('error-text');
            return;
        }

        // Set loading state UI
        const originalBtnText = processBtn.textContent;
        processBtn.classList.add('loading');
        
        jsonOutput.style.opacity = '0.4';
        jsonOutput.textContent = '// Sending to Edge Llama 3.2 Model...\n// Processing and redacting PII...';
        jsonOutput.classList.remove('error-text', 'fade-in');

        try {
            const response = await fetch('https://log-distiller-service-491483155818.asia-south1.run.app/distill_logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: rawText
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Pretty print JSON response
            jsonOutput.textContent = JSON.stringify(data, null, 2);
            jsonOutput.classList.remove('error-text');

        } catch (error) {
            // Handle errors securely
            jsonOutput.textContent = `// Telemetry extraction failed\n// Error: ${error.message}\n// Please ensure the serverless backend is reachable.`;
            jsonOutput.classList.add('error-text');
        } finally {
            // Restore button state
            processBtn.classList.remove('loading');
            
            // Trigger cinematic soft fade-in animation
            jsonOutput.style.opacity = '1';
            
            // Force browser reflow to restart CSS animation
            void jsonOutput.offsetWidth;
            jsonOutput.classList.add('fade-in');
        }
    });
});
