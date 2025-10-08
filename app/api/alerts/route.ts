import { NextRequest, NextResponse } from 'next/server'
import { metronomeAPI, transformMetronomeAlert } from '@/lib/metronome-api'

export async function GET(request: NextRequest) {
  try {
    // Check if API token is configured
    if (!process.env.METRONOME_API_TOKEN) {
      console.log('No Metronome API token configured, using mock data')
      // Return mock data if no API token is configured
      const { mockThresholdNotifications } = await import('@/lib/mock-data')
      return NextResponse.json({
        data: mockThresholdNotifications,
        source: 'mock'
      })
    }

    console.log('Metronome API token found, attempting to fetch real data...')
    // Fetch real data from Metronome API for specific customer
    const { alerts: metronomeAlerts, customer } = await metronomeAPI.getAllAlerts()
    console.log('Received alerts from Metronome:', metronomeAlerts.length)
    console.log('Customer name:', customer.name)
    
    const transformedAlerts = metronomeAlerts.map(alert => 
      transformMetronomeAlert(alert, customer)
    )

    return NextResponse.json({
      data: transformedAlerts,
      source: 'metronome'
    })
  } catch (error) {
    console.error('Failed to fetch alerts:', error)
    
    // Fallback to mock data on error
    const { mockThresholdNotifications } = await import('@/lib/mock-data')
    return NextResponse.json({
      data: mockThresholdNotifications,
      source: 'mock',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
