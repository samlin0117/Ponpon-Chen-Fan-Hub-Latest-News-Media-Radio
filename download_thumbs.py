import urllib.request

data = [
  {
    "id": "DJbeXx1z078",
    "thumbnail": "https://instagram.ftpe21-1.fna.fbcdn.net/v/t51.71878-15/496716786_591414493322480_301148707194274503_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=107&ig_cache_key=MzYyODYyNzUwMDIzNjQ5MjU0MA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNMSVBTLnhwaWRzLjY0MC5zZHIudmlkZW9fZGVmYXVsdF9jb3Zlcl9mcmFtZS5DMyJ9&_nc_ohc=eLxbIB9B4m0Q7kNvwFVQ938&_nc_oc=AdqYQ6d_CNw-RsIw7KqbgGhaeTQOSHQDhf5o9eJPB_TMRQ-5pNHtJE1KML8sVmHgCoY&_nc_zt=23&_nc_ht=instagram.ftpe21-1.fna&_nc_gid=WSKo-t5utdph7iOgzVAHzg&_nc_ss=7e689&oh=00_AQA_nPcEw5P03c-z4enCM7vIybKLKaSrS4qUz5_Op40pYA&oe=6A6E0EA8"
  },
  {
    "id": "DWywNjjE7uu",
    "thumbnail": "https://instagram.ftpe21-1.fna.fbcdn.net/v/t51.71878-15/658983390_1586739142421555_7653695104195467305_n.jpg?stp=dst-jpegr_e15_tt6&_nc_cat=103&ig_cache_key=Mzg2OTM2NzA2NzYxOTg2NzU2Ng%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNMSVBTLnhwaWRzLjY0MC5oZHIudmlkZW9fZGVmYXVsdF9jb3Zlcl9mcmFtZS5DMyJ9&_nc_ohc=Xoca33_9ukYQ7kNvwGLO5pf&_nc_oc=Adp2_OO2tJwmZgvKTDRu6Bxtp3oxD7ijn6hL2QSQ2T9pxn0vdjHjup9Mu3CnEdr0xHM&_nc_zt=23&se=-1&_nc_ht=instagram.ftpe21-1.fna&_nc_gid=ydfeBHLGTI47Wl2BtDJHtA&_nc_ss=7e689&oh=00_AQCIZdluZghXoUm8YgAtkTMReVog9t4qCJp8cMd0DXW3XA&oe=6A6DEA09"
  },
  {
    "id": "DXrpoJFjWeK",
    "thumbnail": "https://instagram.ftpe21-1.fna.fbcdn.net/v/t51.71878-15/683491865_1620325059200138_4995833825485604656_n.jpg?stp=dst-jpegr_e15_tt6&_nc_cat=100&ig_cache_key=Mzg4NTM4MjE4MTk4MDAzOTA1MA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNMSVBTLnhwaWRzLjY0MC5oZHIudmlkZW9fbmZyYW1lX2NvdmVyX2ZyYW1lLkMzIn0%3D&_nc_ohc=SNonBj4vZOAQ7kNvwFuvvVx&_nc_oc=AdokTY3m5sumZlXp0WBcoFSYNFwdxJOCw1u-NOBs6AJdpgv32lTMW7vEL5It9D81kUo&_nc_zt=23&se=-1&_nc_ht=instagram.ftpe21-1.fna&_nc_gid=6oHMK7PLIt9d2IRyIHd2nA&_nc_ss=7e689&oh=00_AQDlTrUjbvLLVAskrf2DA3p9QcUC2bK42-Eqmx90EPM-7Q&oe=6A6DDDA8"
  },
  {
    "id": "DJ7CPUezm1q",
    "thumbnail": "https://instagram.ftpe21-1.fna.fbcdn.net/v/t51.75761-15/500111546_18275027308262814_7350359796879235538_n.jpg?stp=dst-jpg_e15_tt6&_nc_cat=111&ig_cache_key=MzYzNzUxMDk3MjkwODY2MjEyMg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNMSVBTLnhwaWRzLjExNzAuc2RyLnZpZGVvX2RlZmF1bHRfY292ZXJfZnJhbWUuQzMifQ%3D%3D&_nc_ohc=Q8AaqYuFsi0Q7kNvwH3SyoM&_nc_oc=Ado26ZanwNXBvRDDo2-0okw-4kCVi9SgZ6X2YL-d1tLMmkPke3beFbbHrdu9hTSrnIw&_nc_zt=23&_nc_ht=instagram.ftpe21-1.fna&_nc_gid=0_SsmTSc-sa6dzY0NfdmFg&_nc_ss=7e689&oh=00_AQBY-y3rks8Hb6iRZJNfoEKdcq7dpBfBXzv4guVaTaX29w&oe=6A6DFC60"
  }
]

for item in data:
    req = urllib.request.Request(item['thumbnail'], headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response:
            content = response.read()
            with open(f"public/ig-{item['id']}.jpg", 'wb') as f:
                f.write(content)
        print(f"Downloaded ig-{item['id']}.jpg")
    except Exception as e:
        print(f"Failed to download {item['id']}: {e}")
