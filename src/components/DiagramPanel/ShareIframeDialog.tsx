import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography } from '@mui/material';
import { getMermaidCodeFromUrl } from '@/lib/url.utils';
import { encodeMermaid } from '@/lib/utils';

interface ShareIframeDialogProps {
    open: boolean;
    onClose: () => void;
}


const ShareIframeDialog: React.FC<ShareIframeDialogProps> = ({ open, onClose }) => {
    const [copiedLink, setCopiedLink] = useState(false);
    const [copiedEmbed, setCopiedEmbed] = useState(false);

    const encodedData = encodeMermaid(getMermaidCodeFromUrl());

    const shareUrl = `${window.location.origin}/iframe?mermaid=${encodedData}`;
    const embedCode = `<iframe src="${shareUrl}" width="600" height="400"></iframe>`;

    const handleCopy = (text: string, type: 'link' | 'embed') => {
        navigator.clipboard.writeText(text).then(() => {
            if (type === 'link') {
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2000);
            } else {
                setCopiedEmbed(true);
                setTimeout(() => setCopiedEmbed(false), 2000);
            }
        });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Share Diagram</DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 2, p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Direct Link:</Typography>
                    <TextField
                        fullWidth
                        value={shareUrl}
                        InputProps={{ readOnly: true }}
                        sx={{ mt: 1 }}
                    />
                    <Button
                        variant="outlined"
                        onClick={() => handleCopy(shareUrl, 'link')}
                        sx={{ mt: 1 }}
                    >
                        {copiedLink ? 'Copied!' : 'Copy Link'}
                    </Button>
                </Box>
                <Box sx={{ p: 2, borderRadius: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Embed Code:</Typography>
                    <TextField
                        fullWidth
                        value={embedCode}
                        InputProps={{ readOnly: true }}
                        sx={{ mt: 1 }}
                    />
                    <Button
                        variant="outlined"
                        onClick={() => handleCopy(embedCode, 'embed')}
                        sx={{ mt: 1 }}
                    >
                        {copiedEmbed ? 'Copied!' : 'Copy Embed Code'}
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShareIframeDialog;