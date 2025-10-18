import { NextRequest, NextResponse } from 'next/server'
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

// Configuration Amplify - utiliser les sorties générées automatiquement
const amplifyOutputs = {
  "storage": {
    "aws_region": "eu-west-3",
    "bucket_name": "amplify-d17uxdu2napxpc-ma-amplifyalphdmeshesbucket-4rknaslwb6z4"
  }
}

// Configuration S3 avec les valeurs d'Amplify
const s3Client = new S3Client({
  region: amplifyOutputs.storage.aws_region
})

const BUCKET_NAME = amplifyOutputs.storage.bucket_name

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    // Logs de diagnostic pour Amplify
    console.log('=== API Route - Configuration Amplify ===')
    console.log('Région AWS:', amplifyOutputs.storage.aws_region)
    console.log('Bucket S3:', BUCKET_NAME)

    // Lister les objets dans le bucket S3
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'meshes/'
    })

    console.log('Tentative de connexion au bucket:', BUCKET_NAME)

    let response
    try {
      response = await s3Client.send(command)
      console.log('Réponse S3 reçue:', response?.Contents?.length || 0, 'objets trouvés')
    } catch (s3Error) {
      console.error('Erreur S3 spécifique:', s3Error)
      return NextResponse.json(
        {
          error: 'Erreur d\'accès au bucket S3',
          details: s3Error instanceof Error ? s3Error.message : 'Erreur inconnue S3'
        },
        {
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

    if (!response.Contents) {
      console.log('Aucun contenu trouvé dans le bucket')
      return NextResponse.json([])
    }

    // Filtrer et formater les URLs des fichiers .ply
    const modelUrls = response.Contents
      .filter((object) => {
        const isPly = object.Key?.endsWith('.final.ply')
        if (isPly) {
          console.log('Fichier PLY trouvé:', object.Key)
        }
        return isPly
      })
      .map((object) => {
        // Construire l'URL publique S3
        const url = `https://${BUCKET_NAME}.s3.${amplifyOutputs.storage.aws_region}.amazonaws.com/${object.Key}`
        console.log('URL générée:', url)
        return url
      })
      .filter(Boolean)

    console.log('Total URLs générées:', modelUrls.length)

    return NextResponse.json(modelUrls, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=300' // Cache 5 minutes
      }
    })

  } catch (error) {
    console.error('Erreur générale lors de la récupération des modèles:', error)
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')

    return NextResponse.json(
      {
        error: 'Erreur serveur interne',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
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