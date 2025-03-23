# SSL Certificate Setup for TiDB Cloud Connection

## Overview

We've implemented a robust, multi-layered approach to secure the connection to TiDB Cloud for all users. This document explains the enhanced setup and what to verify.

## What Has Been Set Up

### 1. Enhanced Certificate Handling

The system now tries multiple methods to establish a secure connection, in this order:

1. **Certificate File Search**: Looks for `isrgrootx1.pem` in multiple potential locations
2. **Environment Variable Certificate**: Falls back to a certificate stored in the `DB_CA_CERT` environment variable
3. **System Certificates**: Tries to use built-in trusted certificates
4. **Permissive SSL Mode**: If needed, tries a less strict SSL configuration
5. **No SSL Fallback**: As a last resort, attempts a non-SSL connection

### 2. Server.js Updates

- Added more robust error handling for all connection scenarios
- Improved logging to better diagnose connection issues
- Implemented a multi-step fallback approach for maximum reliability
- Added connection pooling settings for better stability

### 3. Vercel Configuration

- Updated `vercel.json` to include `.pem` files in the deployment
- This ensures the certificate is available in the Vercel serverless environment

## Setup For All Users

To ensure feedback submission works for everyone, not just on your device, add the certificate as an environment variable:

1. **Convert the certificate to base64**:
   - On Linux/Mac: `cat isrgrootx1.pem | base64`
   - On Windows: `certutil -encode isrgrootx1.pem temp.b64 && findstr /v /c:- temp.b64 > cert.b64 && type cert.b64`

2. **Add it as an environment variable in Vercel**:
   - Go to your Vercel dashboard → Project → Settings → Environment Variables
   - Add a new variable named `DB_CA_CERT`
   - Paste the entire base64-encoded certificate as the value
   - Save your changes

## Verifying the Setup

After deployment to Vercel:

1. **Check the connection**:
   - Visit `https://knowindiaback.vercel.app/api/db-test`
   - You should see a successful connection response

2. **Test with a different device**:
   - Have someone else try to submit feedback from their device
   - This will verify the connection works across different clients

## Troubleshooting

If users are still experiencing issues:

1. **Check Vercel logs**:
   - Go to your Vercel dashboard → Project → Deployments → Latest deployment → Functions
   - Look for any errors in the function logs
   - See which connection method is being used

2. **Verify TiDB Cloud settings**:
   - Log into TiDB Cloud and check:
     - Is the database active?
     - Are there any IP restrictions?
     - Is SSL/TLS properly configured?

3. **Test locally first**:
   - Run the server locally with the exact same environment variables
   - See if the connection succeeds locally before deploying

## Resources

- [TiDB Cloud SSL Documentation](https://docs.pingcap.com/tidbcloud/secure-connections-to-serverless-tier-clusters)
- [MySQL2 SSL Options](https://github.com/sidorares/node-mysql2#ssl-options)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables) 