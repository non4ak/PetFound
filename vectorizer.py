import torch
from transformers import ViTImageProcessor, ViTModel
from PIL import Image

class PetVectorizer:
    def __init__(self):
        self.processor = ViTImageProcessor.from_pretrained('google/vit-base-patch16-224')
        self.model = ViTModel.from_pretrained('google/vit-base-patch16-224')
        
        self.model.eval()

    def get_vector(self, cropped_image_path: str) -> list:
        image = Image.open(cropped_image_path).convert("RGB")
        
        inputs = self.processor(images=image, return_tensors="pt")
        
        with torch.no_grad():
            outputs = self.model(**inputs)
            
        embeddings = outputs.pooler_output[0].tolist()
        
        return embeddings