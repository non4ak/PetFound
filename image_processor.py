import os
import torch
from PIL import Image

class PetProcessor:
    def __init__(self):
        self.model = torch.hub.load('ultralytics/yolov5', 'custom', path='megadetector_v5a.pt', trust_repo=True)
        self.model.conf = 0.45 

    def process_and_crop(self, image_path: str, output_dir: str) -> dict:
        try:
            img = Image.open(image_path).convert("RGB")
            results = self.model(image_path)
            predictions = results.pandas().xyxy[0]

            if predictions.empty:
                return {"status": "no_animal_found"}

            best_match = predictions.iloc[0]
            
            xmin, ymin, xmax, ymax = int(best_match['xmin']), int(best_match['ymin']), int(best_match['xmax']), int(best_match['ymax'])
            
            cropped_img = img.crop((xmin, ymin, xmax, ymax))
            
            filename = os.path.basename(image_path)
            output_path = os.path.join(output_dir, f"crop_{filename}")
            cropped_img.save(output_path)

            return {
                "status": "success",
                "output_path": output_path,
                "confidence": float(best_match['confidence'])
            }
        except Exception as e:
            return {"status": "error", "message": str(e)}