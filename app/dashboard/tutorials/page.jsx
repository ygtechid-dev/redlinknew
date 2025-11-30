"use client";
import { useEffect, useState } from "react";
import { Youtube } from "lucide-react";

export default function TutorialPage() {
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const CHANNEL_ID = "UCN3QlmXjD8dhaSpvzHJBTKw";

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const fetchVideos = async () => {
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=20`
      );
      const data = await res.json();
      setVideos(data.items || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching videos", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Youtube className="w-6 h-6 text-red-600" />
            Tutorial Videos
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Selected Video Player */}
        {selectedVideo && (
          <div className="mb-10">
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <p className="text-center text-gray-600">Loading videos...</p>
        ) : videos.length === 0 ? (
          <p className="text-center text-gray-600">No videos found.</p>
        ) : (
          /* Grid List */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => {
              const videoId = video.id.videoId;
              const snippet = video.snippet;

              if (!videoId) return null;

              return (
                <div
                  key={videoId}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer"
                  onClick={() => setSelectedVideo(videoId)}
                >
                  <img
                    src={snippet.thumbnails.high.url}
                    alt={snippet.title}
                    className="w-full"
                  />

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-sm mb-2">
                      {snippet.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {snippet.description}
                    </p>

                    <button className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-semibold transition">
                      Play Video
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
