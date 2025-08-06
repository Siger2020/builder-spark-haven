import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Wifi,
  WifiOff,
  Activity,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { emailJSService } from "../services/emailJSService";
import {
  ConnectionStatus,
  getConnectionStatusText,
  getConnectionStatusColor,
} from "../lib/emailConfig";

interface EmailJSStatusProps {
  connectionStatus: ConnectionStatus;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function EmailJSStatus({
  connectionStatus,
  onRefresh,
  isRefreshing = false,
}: EmailJSStatusProps) {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPendingCount(emailJSService.getPendingRequestsCount());
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case ConnectionStatus.NOT_CONFIGURED:
        return <WifiOff className="w-4 h-4" />;
      case ConnectionStatus.CONFIGURED:
        return <Activity className="w-4 h-4" />;
      case ConnectionStatus.TESTING:
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case ConnectionStatus.CONNECTED:
        return <Wifi className="w-4 h-4" />;
      case ConnectionStatus.ERROR:
        return <XCircle className="w-4 h-4" />;
      default:
        return <WifiOff className="w-4 h-4" />;
    }
  };

  const getStatusVariant = () => {
    switch (connectionStatus) {
      case ConnectionStatus.CONNECTED:
        return "default";
      case ConnectionStatus.ERROR:
        return "destructive";
      case ConnectionStatus.TESTING:
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant={getStatusVariant()} className="font-arabic">
        {getStatusIcon()}
        <span className="mr-1">
          {getConnectionStatusText(connectionStatus)}
        </span>
      </Badge>

      {pendingCount > 0 && (
        <Badge variant="secondary" className="font-arabic">
          <Activity className="w-3 h-3 ml-1" />
          {pendingCount} طلب معلق
        </Badge>
      )}

      {onRefresh && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onRefresh}
          disabled={isRefreshing || pendingCount > 0}
          className="h-6 px-2"
        >
          <RefreshCw
            className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </Button>
      )}

      {connectionStatus === ConnectionStatus.CONNECTED && (
        <CheckCircle className="w-4 h-4 text-green-600" />
      )}

      {connectionStatus === ConnectionStatus.ERROR && (
        <AlertTriangle className="w-4 h-4 text-red-600" />
      )}
    </div>
  );
}
