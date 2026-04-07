import { memo } from "react";
import { motion } from "framer-motion";
import { WifiOff, RefreshCw, AlertTriangle } from "lucide-react";

const ErrorState = ({ message, onRetry, type = "network" }) => {
  const isNetwork = type === "network";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-16 px-6"
    >
      {/* Animated Icon Container */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        className="relative mb-6"
      >
        {/* Glow ring */}
        <div
          className="
            absolute inset-0 rounded-full blur-xl opacity-30
          "
          style={{
            background: isNetwork
              ? "radial-gradient(circle, rgba(239,68,68,0.4), transparent)"
              : "radial-gradient(circle, rgba(234,179,8,0.4), transparent)",
          }}
        />

        <div
          className="
            relative w-20 h-20 rounded-full
            flex items-center justify-center
            border border-white/10
          "
          style={{
            background: isNetwork
              ? "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))"
              : "linear-gradient(135deg, rgba(234,179,8,0.15), rgba(234,179,8,0.05))",
          }}
        >
          {isNetwork ? (
            <WifiOff size={32} className="text-red-400" />
          ) : (
            <AlertTriangle size={32} className="text-yellow-400" />
          )}
        </div>
      </motion.div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-2">
        {isNetwork ? "Connection Issue" : "Something went wrong"}
      </h3>

      {/* Message */}
      <p className="text-sm text-white/50 text-center max-w-sm mb-6 leading-relaxed">
        {message ||
          (isNetwork
            ? "Unable to reach the movie database. This might be due to your network or ISP restrictions."
            : "We couldn't load the content. Please try again.")}
      </p>

      {/* Retry Button */}
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="
            flex items-center gap-2
            px-6 py-2.5 rounded-full
            bg-gradient-to-r from-yellow-500 to-amber-500
            text-black text-sm font-semibold
            shadow-lg shadow-yellow-500/20
            hover:shadow-yellow-500/40
            transition-shadow duration-300
            cursor-pointer
          "
        >
          <RefreshCw size={16} />
          Try Again
        </motion.button>
      )}

      {/* Troubleshooting Tips */}
      {isNetwork && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-xs text-white/30 text-center space-y-1"
        >
          <p>💡 Troubleshooting tips:</p>
          <p>• Check your internet connection</p>
          <p>• Try using a VPN if TMDB is blocked in your region</p>
          <p>• Disable any ad-blockers that might interfere</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default memo(ErrorState);
