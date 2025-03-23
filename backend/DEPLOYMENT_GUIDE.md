# Deployment Troubleshooting Guide

## Overview

This guide helps troubleshoot deployment issues with the Know India backend on Vercel, particularly related to SSL certificates for the TiDB Cloud database connection.

## Recent Changes

We've implemented several improvements to make the deployment more robust:

1. **Certificate Handling**: The server now searches multiple locations for the SSL certificate
2. **Certificate Storage**: Created a special `/certs` directory that is included in Git
3. **Fallback Mechanisms**: Added environment variable fallback for certificate
4. **Deployment Testing**: Added diagnostic tools to verify certificate availability

## Step-by-Step Deployment Guide

### 1. Prepare Your Repository

Make sure these files are properly in place:

- `backend/certs/isrgrootx1.pem` - SSL certificate (included in Git)
- `backend/vercel.json` - Configured to include certificate files
- `.gitignore` and `backend/.gitignore` - Updated to allow `/certs` directory

### 2. Configure Vercel Environment Variables

1. Go to your Vercel dashboard → Project → Settings → Environment Variables
2. Ensure all database variables are set:

   ```
   DB_HOST=gateway01.us-east-1.prod.aws.tidbcloud.com
   DB_PORT=4000
   DB_USERNAME=2iSfDhKtBbfFXST.root
   DB_PASSWORD=69hUo71LG3LgdnEZ
   DB_DATABASE=test
   DB_SSL=true
   ```

3. Add the certificate as a fallback:
   - Add `DB_CA_CERT` with the contents of `cert_base64.txt`

### 3. Deployment Process

1. Commit all your changes:
   ```
   git add .
   git commit -m "Updated certificate handling for Vercel deployment"
   ```

2. Push to your repository:
   ```
   git push
   ```

3. Wait for Vercel to deploy your project

### 4. Troubleshooting Deployment

If the deployment fails, check these common issues:

#### Certificate Issues

- **Check Vercel build logs**: Look for certificate search messages from `deploy-test.js`
- **Verify certificate in repo**: Make sure `backend/certs/isrgrootx1.pem` is included in Git
- **Check vercel.json**: Ensure `includeFiles` includes `certs/**`

#### Database Connection Issues

- **Test DB connection**: Visit `/api/db-test` to see connection status
- **Check credentials**: Verify all DB environment variables are correct
- **SSL configuration**: Ensure `DB_SSL` is set to `true`

#### Last Resort Options

If you're still having issues:

1. **Temporarily disable SSL**:
   - Set `DB_SSL` to `false` (less secure, only for testing)
   - This will show if SSL is the specific issue

2. **Try direct base64 environment variable**:
   - Make sure `DB_CA_CERT` is set with the base64 certificate value

3. **Consider alternative database**:
   - Switch to Vercel's built-in Postgres: https://vercel.com/docs/storage/vercel-postgres

## Testing After Deployment

1. **Health check**: `https://knowindiaback.vercel.app/api/health`
2. **Database test**: `https://knowindiaback.vercel.app/api/db-test`
3. **Feedback form**: Have users test the feedback form submission

## Monitoring Production

Check the Function Logs in Vercel dashboard to monitor database connections and any errors in production. 