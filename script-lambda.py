import json
import boto3
import urllib.parse
import requests

rekognition = boto3.client('rekognition')
s3 = boto3.client('s3')

def lambda_handler(event, context):
    # Obtener información del evento S3
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'])
    image_url = f"https://{bucket}.s3.amazonaws.com/{key}"
    
    try:
        # Llamar a Rekognition para analizar la imagen
        response = rekognition.detect_labels(
            Image={'S3Object': {'Bucket': bucket, 'Name': key}},
            MaxLabels=5,
            MinConfidence=75
        )
        
        # Tomar algunas etiquetas para simular nombre, tipo, descripción
        etiquetas = response.get('Labels', [])
        nombre = etiquetas[0]['Name'] if etiquetas else 'Producto Desconocido'
        descripcion = ", ".join([label['Name'] for label in etiquetas]) if etiquetas else "Sin descripción"
        tipo = etiquetas[1]['Name'] if len(etiquetas) > 1 else "Tipo Desconocido"
        
        # Construir el JSON
        data = {
            "nombre": nombre,
            "descripcion": descripcion,
            "tipoDeProducto": tipo,
            "urlImage": image_url
        }

        # Enviar el JSON a tu API
        api_url = "http://3.84.203.242:3000/products"
        headers = {"Content-Type": "application/json"}
        r = requests.post(api_url, data=json.dumps(data), headers=headers)
        
        if r.status_code == 200 or r.status_code == 201:
            return {
                'statusCode': 200,
                'body': json.dumps('Producto guardado exitosamente.')
            }
        else:
            return {
                'statusCode': r.status_code,
                'body': json.dumps(f'Error al guardar el producto: {r.text}')
            }

    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'body': json.dumps(f'Error al procesar la imagen: {str(e)}')
        }
