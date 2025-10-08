# Metronome API Integration Setup

This CSM Dashboard now includes integration with Metronome's API for real-time threshold notifications. The alerts page will automatically fetch data from Metronome when properly configured.

## Setup Instructions

### 1. Get Your Metronome API Token

1. Log in to your Metronome dashboard
2. Navigate to Settings > API Keys
3. Create a new API key with appropriate permissions
4. Copy the generated token

### 2. Configure Environment Variables

Update your `.env.local` file with your Metronome API token:

```bash
# Metronome API Configuration
METRONOME_API_TOKEN=your_actual_metronome_api_token_here
METRONOME_API_BASE_URL=https://api.metronome.com/v1

# Public environment variables (accessible in client-side code)
NEXT_PUBLIC_METRONOME_API_TOKEN=your_actual_metronome_api_token_here
```

### 3. Restart the Development Server

After updating the environment variables, restart your development server:

```bash
npm run dev
```

## How It Works

### API Integration

The integration uses Metronome's [Get all threshold notifications](https://docs.metronome.com/api-reference/alerts/get-all-threshold-notifications) endpoint to fetch real-time alert data.

### Data Flow

1. **Client Request**: The alerts page makes a request to `/api/alerts`
2. **Server-Side API Call**: The API route calls Metronome's API using your token
3. **Data Transformation**: Raw Metronome data is transformed to match the dashboard's format
4. **Response**: Transformed data is sent back to the client

### Fallback Behavior

- **No Token**: Uses mock data for development
- **API Error**: Falls back to mock data with error notification
- **Network Issues**: Graceful error handling with user feedback

## API Endpoints Used

### Get All Threshold Notifications
- **Endpoint**: `POST /v1/customer-alerts/list`
- **Purpose**: Fetch threshold notifications for all customers
- **Documentation**: [Metronome API Docs](https://docs.metronome.com/api-reference/alerts/get-all-threshold-notifications)

### Get All Customers
- **Endpoint**: `POST /v1/customers/list`
- **Purpose**: Fetch customer list to get alerts for each customer
- **Documentation**: [Metronome API Docs](https://docs.metronome.com/api-reference/customers/get-all-customers)

## Features

### Real-Time Alerts
- Fetches live threshold notifications from Metronome
- Displays customer status (ok, in_alarm, evaluating)
- Shows alert types and thresholds

### Error Handling
- Graceful fallback to mock data
- User-friendly error messages
- Loading states and refresh functionality

### Data Transformation
- Converts Metronome's data format to dashboard format
- Maps customer status to severity levels
- Calculates percentages and metrics

## Troubleshooting

### Common Issues

1. **"Metronome API token not configured"**
   - Ensure `METRONOME_API_TOKEN` is set in `.env.local`
   - Restart the development server

2. **"Metronome API error: 401 Unauthorized"**
   - Check that your API token is valid
   - Verify the token has appropriate permissions

3. **"Metronome API error: 404 Not Found"**
   - Ensure you're using the correct API base URL
   - Check that the endpoint exists in your Metronome plan

4. **Data not loading**
   - Check browser console for error messages
   - Verify network connectivity
   - Ensure Metronome API is accessible

### Debug Mode

The API route logs the data source in the console:
- `"Alerts loaded from: metronome"` - Real data from Metronome
- `"Alerts loaded from: mock"` - Fallback mock data

## Security Notes

- API tokens are stored server-side only
- Client-side code never directly accesses Metronome API
- All API calls go through Next.js API routes for security

## Next Steps

Once configured, the alerts page will show real-time data from your Metronome account. You can:

1. View live threshold notifications
2. Monitor customer alert statuses
3. Track usage patterns and trends
4. Take action on critical alerts

For more information about Metronome's API, visit their [API documentation](https://docs.metronome.com/api-reference).
