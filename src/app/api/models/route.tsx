import { NextRequest, NextResponse } from 'next/server'
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
import amplifyOutputs from '../../../../amplify_outputs.json'

// Configuration S3 adaptée selon l'environnement
const createS3Client = () => {
  // // En développement local, utiliser le profil AWS par défaut
  // if (process.env.NODE_ENV === 'development') {
  //   return new S3Client({
  //     region: amplifyOutputs.storage.aws_region,
  //     // Utilise les credentials du profil AWS local
  //   })
  // }

  // En production (Amplify), utiliser les credentials automatiques du rôle IAM
  // Amplify fournit automatiquement les credentials via les variables d'environnement du rôle IAM
  return new S3Client({
    region: amplifyOutputs.storage.aws_region,
    // Les credentials sont automatiquement disponibles via le rôle IAM d'Amplify
  })
}

const s3Client = createS3Client()
const BUCKET_NAME = amplifyOutputs.storage.bucket_name

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_request: NextRequest) {
  try {
    // Logs de diagnostic pour Amplify
    console.log('=== API Route - Configuration Amplify ===')
    console.log('Environnement:', process.env.NODE_ENV || 'production')
    console.log('Région AWS:', amplifyOutputs.storage.aws_region)
    console.log('Bucket S3:', BUCKET_NAME)
    console.log('Configuration chargée depuis amplify_outputs.json')

    if (process.env.NODE_ENV === 'development') {
      console.log('💡 Mode développement: Assurez-vous d\'avoir configuré vos credentials AWS localement')
      console.log('   Utilisez: aws configure ou définissez AWS_PROFILE')
    } else {
      console.log('🚀 Mode production: Utilisation du rôle IAM Amplify')
    }

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

    // Debug: lister tous les objets trouvés
    console.log('🔍 Tous les objets trouvés dans meshes/:')
    response.Contents.forEach((object, index) => {
      console.log(`${index + 1}. ${object.Key}`)
    })

    // Filtrer et formater les URLs des fichiers .ply et .drc
    const modelUrls = response.Contents
      .filter((object) => {
        const isPly = object.Key?.endsWith('.final.ply')
        const isDrc = object.Key?.endsWith('.drc')
        
        if (isPly || isDrc) {
          console.log(`Fichier ${isPly ? 'PLY' : 'DRC'} trouvé:`, object.Key)
        }
        
        return isPly || isDrc
      })
      .map((object) => {
        // Déterminer le format du fichier
        const isPly = object.Key?.endsWith('.final.ply')
        const format = isPly ? 'ply' : 'drc'
        
        // Construire l'URL publique S3 avec la vraie configuration
        const url = `https://${BUCKET_NAME}.s3.${amplifyOutputs.storage.aws_region}.amazonaws.com/${object.Key}`
        console.log(`URL générée pour format ${format}:`, url)
        
        return {
          url: url,
          format: format,
          key: object.Key
        }
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