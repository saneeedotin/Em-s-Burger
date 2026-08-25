from rembg import remove
from PIL import Image

input_path = "public/assets/Meltdown .png"
output_path = "public/assets/Meltdown_transparent.png"

input_image = Image.open(input_path)
output_image = remove(input_image)
output_image.save(output_path)
print("Background removed successfully.")
