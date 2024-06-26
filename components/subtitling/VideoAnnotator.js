import React, { useRef, useState, useEffect } from 'react';

const cornerSize = 10; 

const VideoAnnotator = ({ videoUrl, addRectangle, onRectangleAdded, videoRef, rectIndex, setRectIndex, rectangles, setRectangles }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [selectedRectIndex, setSelectedRectIndex] = useState(null);
  const [dragStartPoint, setDragStartPoint] = useState(null);
  const [resizeCorner, setResizeCorner] = useState(null);
  const [currentRect, setCurrentRect] = useState(null);
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);
  const [originalWidth, setOriginalWidth] = useState(null);
  const [originalHeight, setOriginalHeight] = useState(null);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  


  useEffect(() => {
    if (addRectangle) {
      const newRect = {
        start: { x: 100, y: 100 }, 
        end: { x: 200, y: 200 }, 
      };

      setRectangles([...rectangles, newRect]);
      setCurrentRect(null);
      onRectangleAdded();
    }
  }, [addRectangle, onRectangleAdded]);

    useEffect(() => {
      if (height){
        console.log(height, width);
        console.log(originalHeight, originalWidth);
      }
    },[height,width,originalHeight, originalWidth]);

    useEffect(() => {
      const video = videoRef.current;
  
      const handleMetadataLoaded = () => {
        setWidth(videoRef.current.offsetWidth);
        setHeight(videoRef.current.offsetHeight);
        setOriginalWidth(videoRef.current.videoWidth);
        setOriginalHeight(videoRef.current.videoHeight);
      };
  
      
      if (video) {
        video.addEventListener('loadedmetadata', handleMetadataLoaded);
      }
  
      return () => {
        if (video) {
          video.removeEventListener('loadedmetadata', handleMetadataLoaded);
        }
      };
    }, [videoRef]);

    useEffect(() => {
      const updateSize = () => {
        if (videoRef.current) {
          setWidth(videoRef.current.offsetWidth);
          setHeight(videoRef.current.offsetHeight);
        }
      };
  
      window.addEventListener('resize', updateSize);
  
      updateSize();
  
      return () => {
        window.removeEventListener('resize', updateSize);
      };
    }, []);

    useEffect(() => {
      if (originalWidth && originalHeight && width && height) {
        setScaleX(width / originalWidth);
        setScaleY(height / originalHeight);
      }
    }, [width, height, originalWidth, originalHeight]);

    useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      console.log(rectangles)
  
      const drawRectangles = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        rectangles.forEach((rect, index) => {
          if (index != rectIndex || !rect){
            return;
          }

          const startX = rect.start.x * scaleX;
          const startY = rect.start.y * scaleY;
          const endX = (rect.end.x - rect.start.x) * scaleX;
          const endY = (rect.end.y - rect.start.y) * scaleY;
  
          context.beginPath();
          context.rect(startX, startY, endX, endY);
          context.strokeStyle = selectedRectIndex === index ? 'blue' : 'red';
          context.stroke();


          const handleSize = cornerSize; 
          const handleLocations = [
            { x: startX - handleSize / 2, y: startY - handleSize / 2 }, 
            { x: startX + endX - handleSize / 2, y: startY - handleSize / 2 },
            { x: startX - handleSize / 2, y: startY + endY - handleSize / 2 },
            { x: startX + endX - handleSize / 2, y: startY + endY - handleSize / 2 },
          ];

          handleLocations.forEach(handle => {
            context.beginPath();
            context.rect(handle.x, handle.y, handleSize, handleSize);
            context.fillStyle = 'red';
            context.fill();
            context.strokeStyle = 'red';
            context.stroke();
          });
        });
      };
  
      drawRectangles();
    }, [rectangles, selectedRectIndex, scaleX, scaleY, width, height, rectIndex]);

  const checkForResizeCorner = (x, y, rect) => {
    if (!rect) return null;
    const { start, end } = rect;

    if (Math.abs(start.x - x) < cornerSize && Math.abs(start.y - y) < cornerSize) return 'tl';
    if (Math.abs(end.x - x) < cornerSize && Math.abs(start.y - y) < cornerSize) return 'tr';
    if (Math.abs(start.x - x) < cornerSize && Math.abs(end.y - y) < cornerSize) return 'bl';
    if (Math.abs(end.x - x) < cornerSize && Math.abs(end.y - y) < cornerSize) return 'br';

    return null;
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaledX = (e.clientX - rect.left) / scaleX; 
    const scaledY = (e.clientY - rect.top) / scaleY; 
  
    let handled = false;
  
    for (let i = 0; i < rectangles.length; i++) {
      if (!rectangles[i]){
        continue;
      }
      const corner = checkForResizeCorner(scaledX, scaledY, rectangles[i]);
      console.log(corner);
      if (corner) {
        setIsResizing(true);
        setResizeCorner(corner);
        setSelectedRectIndex(i);
        handled = true;
        break;
      }
  
      if (scaledX >= rectangles[i].start.x && scaledX <= rectangles[i].end.x && scaledY >= rectangles[i].start.y && scaledY <= rectangles[i].end.y) {
        setIsMoving(true);
        setSelectedRectIndex(i);
        handled = true;
        break;
      }
    }
  
    setDragStartPoint({ x: scaledX, y: scaledY });
  };

  const handleMouseMove = (e) => {
    if (!isDrawing && !isMoving && !isResizing) return;
  
    const rect = canvasRef.current.getBoundingClientRect();
    const scaledX = (e.clientX - rect.left) / scaleX; 
    const scaledY = (e.clientY - rect.top) / scaleY; 
  
    if (isDrawing) {
      setCurrentRect({ ...currentRect, end: { x: scaledX, y: scaledY } });
    } else if (isMoving) {
      const dx = scaledX - dragStartPoint.x;
      const dy = scaledY - dragStartPoint.y;
  
      let movedRect = rectangles[selectedRectIndex];
      movedRect = {
        ...movedRect,
        start: { x: movedRect.start.x + dx, y: movedRect.start.y + dy },
        end: { x: movedRect.end.x + dx, y: movedRect.end.y + dy },
      };
  
      setRectangles([
        ...rectangles.slice(0, selectedRectIndex),
        movedRect,
        ...rectangles.slice(selectedRectIndex + 1),
      ]);
  
      setDragStartPoint({ x: scaledX, y: scaledY });
    } else if (isResizing) {
      let rect = rectangles[selectedRectIndex];
      let { start, end } = rect;
  
      switch (resizeCorner) {
        case 'tl':
          start = { x: scaledX, y: scaledY };
          break;
        case 'tr':
          start = { x: start.x, y: scaledY };
          end = { x: scaledX, y: end.y };
          break;
        case 'bl':
          start = { x: scaledX, y: start.y };
          end = { x: end.x, y: scaledY };
          break;
        case 'br':
          end = { x: scaledX, y: scaledY };
          break;
      }
  
      const updatedRect = { start, end };
  
      updatedRect.start = { x: Math.min(updatedRect.start.x, updatedRect.end.x), y: Math.min(updatedRect.start.y, updatedRect.end.y) };
      updatedRect.end = { x: Math.max(updatedRect.start.x, updatedRect.end.x), y: Math.max(updatedRect.start.y, updatedRect.end.y) };
  
      setRectangles([
        ...rectangles.slice(0, selectedRectIndex),
        updatedRect,
        ...rectangles.slice(selectedRectIndex + 1),
      ]);
    }
  };
  

  const handleMouseUp = () => {
    if (isDrawing && currentRect) {
      setRectangles([...rectangles, currentRect]);
      setCurrentRect(null);
    }

    setIsDrawing(false);
    setIsMoving(false);
    setIsResizing(false);
    setSelectedRectIndex(null);
    setResizeCorner(null);
    setDragStartPoint(null);
  };

  return (
    <div className="relative">
      <video ref={videoRef} style={{ height: 'calc(100vh - 260px)' }}>
        <source src={videoUrl} type="video/mp4" />
      </video>
      <canvas
        ref={canvasRef}
        width={width ? width : 0}
        height={height ? height: 0}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'auto', zIndex: 10 }}
      />
    </div>




  );
};

export default VideoAnnotator;