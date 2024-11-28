import React from 'react'
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Webcam from "react-webcam";



const CameraList = () => {
    const [deviceId, setDeviceId] = React.useState('');
    const [devices, setDevices] = React.useState([]);
  
    const handleDevices = React.useCallback(
      (mediaDevices) =>
        setDevices(mediaDevices.filter(({ kind }) => kind === 'videoinput')),
      [setDevices]
    );
  
    React.useEffect(() => {
      navigator.mediaDevices.enumerateDevices().then(handleDevices);
    }, [handleDevices]);
  
    const handleChange = (event) => {
      setDeviceId(event.target.value);
    };
  
    return (
      <Box>
        <FormControl fullWidth sx={{ minWidth: 120 }}>
          <InputLabel id="camera-select-label">Select Camera</InputLabel>
          <Select
            labelId="camera-select-label"
            id="camera-select"
            value={deviceId}
            label="Select Camera"
            onChange={handleChange}
          >
            {devices.map((device, index) => (
              <MenuItem key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${index + 1}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {deviceId && (
          <Webcam
            audio={false}
            videoConstraints={{ deviceId }}
            style={{ marginTop: '1rem', width: '100%' }}
          />
        )}
      </Box>
    );
  };

export default CameraList;