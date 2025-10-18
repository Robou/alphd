import { NextRequest, NextResponse } from 'next/server'
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'



// Configuration S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'eu-west-3'
})

const BUCKET_NAME = process.env.MODELS_BUCKET || 'amplify-d17uxdu2napxpc-ma-amplifyalphdmeshesbucket-4rknaslwb6z4'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    // Lister les objets dans le bucket S3
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'meshes/'
    })

    console.log('bucket name: ', BUCKET_NAME)
    const response = await s3Client.send(command)

    if (!response.Contents) {
      return NextResponse.json([])
    }

    // Filtrer et formater les URLs des fichiers .nxz
    const modelUrls = response.Contents
      .filter((object) => object.Key?.endsWith('.final.ply'))
      .map((object) => {
        // Construire l'URL publique S3
        return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'eu-west-3'}.amazonaws.com/${object.Key}`
      })
      .filter(Boolean)

    return NextResponse.json(modelUrls, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=300' // Cache 5 minutes
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des modèles:', error)

    return NextResponse.json(
      { error: 'Erreur serveur' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
}

// Gestion des requêtes OPTIONS pour CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}