import logging
from service.handleFindUser import detect_person_using_mtcnn, suggest_friend_logic, add_or_update_embedding
from utils.image_utils import load_image_from_url
import redis
import json

# Cấu hình logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Kết nối Redis
r = redis.StrictRedis(host='redis', port=6379, db=0)

def process_task(task):
    task_id = task['task_id']
    action = task['action']
    data = task['data']
    user_id = data['user_id']
    image_url = data['image_url']
    
    try:
        logging.info(f"Processing task {task_id} with action {action}")
        
        # Tải ảnh từ URL
        image = load_image_from_url(image_url)
        if image is None:
            logging.warning(f"Unable to load image from URL: {image_url}")
            r.publish(task_id, json.dumps({
                'status': 'failed',
                'message': "Unable to load image from URL"
            }))
            return  # Dừng nếu không tải được ảnh
        
        # Phát hiện người trong ảnh
        has_person = detect_person_using_mtcnn(image)
        if not has_person:
            logging.warning(f"No person detected in the image: {task_id}")
            r.publish(task_id, json.dumps({
                'status': 'failed',
                'message': "No person detected in the image"
            }))
            return  # Dừng nếu không phát hiện người
        
        logging.info(f"Person detected in the image, continuing processing for task {task_id}")
        
        # Xử lý các hành động
        if action == 'embed_image':
            logging.info(f"Embedding image for task {task_id}")
            embed_result = add_or_update_embedding(user_id, image)  # Xử lý nhúng ảnh
            logging.info(f"Image embedding result: {embed_result}")
            r.publish(task_id, json.dumps(embed_result))
        
        elif action == 'suggest_friend_by_image':
            logging.info(f"Processing friend suggestion by image for task {task_id}")
            suggestion_result = suggest_friend_logic(user_id, image)  # Logic đề xuất bạn bè
            result_with_user_id = {
                "reciveId": user_id,
                "suggestion_result": suggestion_result
            }
            logging.info(f"Friend suggestion result: {result_with_user_id}")
            r.publish('updateSuggestFriend', json.dumps(result_with_user_id))
        
        else:
            logging.warning(f"Invalid action: {action} for task {task_id}")
            r.publish(task_id, json.dumps({
                'status': 'failed',
                'message': f"Invalid action: {action}"
            }))
    
    except Exception as e:
        logging.error(f"An error occurred while processing task {task_id}: {e}", exc_info=True)
        r.publish(task_id, json.dumps({
            'status': 'failed',
            'message': f"An error occurred during processing: {str(e)}"
        }))
