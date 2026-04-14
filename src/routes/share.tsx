import { Link, QrCode, Copy, Download } from 'lucide-react';
import { useParams } from 'react-router';
import { QRCodeSVG } from 'qrcode.react';


export const SharePage = () => {
    const { id } = useParams();
    const shareLink = `${window.location.origin}/chat/${id ?? ''}`;

    const handleDownloadQR = () => {
        const svg = document.querySelector('#qr-code-svg');
        if (!svg) return;
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const a = document.createElement('a');
            a.download = `qr-code-${id ?? 'agent'}.png`;
            a.href = canvas.toDataURL('image/png');
            a.click();
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    };

    const handleCopyLink = async () => {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(shareLink);
            return;
        }

        const textArea = document.createElement('textarea');
        textArea.value = shareLink;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    };

    return (
        <div className="grow px-20 py-8 bg-background-card">
            <section className=" flex justify-between items-end gap-20 mb-10">
                <div>
                    <h1 className=" text-3xl font-semibold text-text-main">Share</h1>
                    <p className=" text-text-muted mt-1">Distribute your agent — copy a shareable link or download a QR code so others can access it right away."</p>
                </div>
            </section>

            <section className=" space-y-10">
                <div className=' inline-block'>
                    <h2 className=" text-primary mb-3 flex items-center gap-2">
                        <Link size={18} />
                        Link
                    </h2>
                    <p className=" px-5 py-2 bg-primary-light rounded-xl flex items-center gap-3 ">
                        <span className=' text-primary'>{shareLink}</span>
                        <Copy
                            size={18}
                            onClick={() => void handleCopyLink()}
                            aria-label="Copy link"
                            className=" text-text-muted cursor-pointer hover:text-primary transition-colors duration-200"
                        />
                    </p>
                </div>
                <div>
                    <h2 className=" text-primary mb-3 flex items-center gap-2">
                        <QrCode size={18} />
                        QR Code</h2>
                    <div className=' flex items-end'>
                        <div className=" p-2 bg-background-card rounded-xl border border-border-light">
                            <QRCodeSVG id="qr-code-svg" value={shareLink} size={140} />
                        </div>
                        <button
                            onClick={handleDownloadQR}
                            aria-label="Download QR code"
                            className="flex ml-3 border border-primary items-center gap-2 px-3 py-2 text-sm text-primary rounded-md hover:bg-primary hover:text-white transition-colors duration-200 cursor-pointer"
                        >
                            <Download size={16} />
                            Download
                        </button>

                    </div>

                </div>
            </section>
        </div>
    )
}