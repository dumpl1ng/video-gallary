class Video {
    constructor(videoUrl, videoType, description){
        this.videoUrl = videoUrl;
        this.videoType = videoType;
        this.description = description;
    }
}


class VideoNode {
    constructor(capacity){
        this.next = null;
        this.prev = null;
        this.videoList = [capacity];
        this.capacity = capacity;
        this.index = 0;
    }

    append(videoUrl, videoType, description){
        this.videoList[this.index] = new Video(videoUrl, videoType, description);
        this.index++;
        this.capacity --;
    }

    isFull() {
        return this.capacity === 0;
    }

    getVideos() {
        return this.videoList;
    }
}

class LinkedVideoList {
    constructor(nodeCapacity){
        this.head = null;
        this.tail = null;
        this.size = 0;
        this.travelNode = null;
        this.nodeCapacity = nodeCapacity;
    }

    add(videoUrl, videoType, description) {
        if (this.head === null){
            var node = new VideoNode(this.nodeCapacity);
            node.append(videoUrl, videoType, description);

            this.head = node;
            this.tail = node;
            this.size += 1;
            this.travelNode = this.head;
        } else {
            if (!this.head.isFull()){
                this.head.append(videoUrl, videoType, description);
            } else {
                var current = this.head;

                while (current.next) {
                    current = current.next;
                }

                if (!current.isFull()){
                    current.append(videoUrl, videoType, description);
                } else {
                    var node = new VideoNode(this.nodeCapacity);
                    node.append(videoUrl, videoType, description);

                    current.next = node;
                    node.prev = current;
                    this.size += 1;
                    this.tail = node;
                }
            }
        }
    }

    nextNode(){
        if(this.travelNode.next){
            this.travelNode = this.travelNode.next;
        }else {
            this.travelNode = this.head;
        }
        return this.travelNode.getVideos();
    }

    prevNode(){
        if(this.travelNode.prev){
            this.travelNode = this.travelNode.prev;
        }else{
            this.travelNode = this.tail;
        }
        return this.travelNode.getVideos();
    }

    currentNode() {
        return this.travelNode.getVideos();
    }
}