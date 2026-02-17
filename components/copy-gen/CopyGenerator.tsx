'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Upload, X, Copy, Check, MessageSquare, ShoppingBag, Hash, Search, ArrowRight, Wand2 } from 'lucide-react';
import { toast } from 'sonner';

interface GeneratedCopy {
    id: string;
    productName: string;
    generated: string;
    platform: string;
    tone: string;
    createdAt: string;
}

export default function CopyGenerator() {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form State
    const [productName, setProductName] = useState('');
    const [features, setFeatures] = useState('');
    const [keywords, setKeywords] = useState('');
    const [audience, setAudience] = useState('');
    const [platform, setPlatform] = useState('ecommerce');
    const [tone, setTone] = useState('professional');
    const [copyLength, setCopyLength] = useState('medium');

    // Result State
    const [result, setResult] = useState<string | null>(null);
    const [history, setHistory] = useState<GeneratedCopy[]>([]);
    const [copied, setCopied] = useState(false);

    // Load history on mount
    useEffect(() => {
        if (session?.user) {
            fetchHistory();
        }
    }, [session]);

    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/copy-gen/history');
            if (res.ok) {
                const data = await res.json();
                setHistory(data.history);
            }
        } catch (error) {
            console.error('Failed to load history:', error);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image too large. Please select an image under 5MB.');
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleCopy = async () => {
        if (!result) return;

        try {
            // Create plain text version by stripping tags
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = result;
            const plainText = tempDiv.innerText;

            const clipboardData = [
                new ClipboardItem({
                    'text/html': new Blob([result], { type: 'text/html' }),
                    'text/plain': new Blob([plainText], { type: 'text/plain' })
                })
            ];

            await navigator.clipboard.write(clipboardData);

            setCopied(true);
            toast.success('Copied formatted text!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
            // Fallback: Copy plain text only
            try {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = result;
                await navigator.clipboard.writeText(tempDiv.innerText);
                setCopied(true);
                toast.success('Copied text!');
                setTimeout(() => setCopied(false), 2000);
            } catch (fallbackErr) {
                toast.error('Failed to copy text');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!productName && !imageFile) {
            toast.error('Please provide a product name or upload an image.');
            return;
        }

        setIsLoading(true);
        setResult(null);

        try {
            // If image is present, convert to base64
            let imageBase64 = null;
            if (imageFile) {
                imageBase64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(imageFile);
                });
            }

            const response = await fetch('/api/copy-gen', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productName,
                    features,
                    keywords,
                    audience,
                    platform,
                    tone,
                    copyLength,
                    image: imageBase64,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            setResult(data.generatedText);

            // Refresh history
            if (session?.user) {
                fetchHistory();
            }

            toast.success('Copy generated successfully!');
        } catch (error) {
            console.error('Generation error:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to generate copy');
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to render platform-specific preview wrapper
    const renderPreview = () => {
        if (!result) return null;

        if (platform === 'social') {
            return (
                <div className="bg-white border rounded-xl overflow-hidden max-w-md mx-auto shadow-sm">
                    <div className="flex items-center p-3 border-b">
                        <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                        <div>
                            <div className="h-3 w-24 bg-gray-200 rounded mb-1"></div>
                            <div className="h-2 w-16 bg-gray-100 rounded"></div>
                        </div>
                    </div>
                    {imagePreview && (
                        <div className="w-full bg-gray-100 aspect-square">
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div className="p-3">
                        <div className="flex gap-4 mb-3">
                            <div className="w-6 h-6 rounded-full bg-gray-100"></div>
                            <div className="w-6 h-6 rounded-full bg-gray-100"></div>
                            <div className="w-6 h-6 rounded-full bg-gray-100"></div>
                        </div>
                        <div className="text-sm text-gray-800 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: result }} />
                    </div>
                </div>
            );
        }

        if (platform === 'ecommerce') {
            return (
                <div className="bg-white border rounded-xl p-6 shadow-sm">
                    <div className="flex gap-6 flex-col md:flex-row">
                        {imagePreview ? (
                            <div className="w-full md:w-1/3 bg-gray-100 rounded-lg aspect-square">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                            </div>
                        ) : (
                            <div className="w-full md:w-1/3 bg-gray-100 rounded-lg aspect-square flex items-center justify-center text-gray-400">
                                Product Image
                            </div>
                        )}
                        <div className="w-full md:w-2/3">
                            <h3 className="text-xl font-medium text-gray-900 mb-2">{productName || 'Product Title'}</h3>
                            <div className="flex items-center mb-4">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-4 h-4 text-yellow-400 fill-current">★</div>)}
                                <span className="text-sm text-blue-600 ml-2">128 ratings</span>
                            </div>
                            <div className="h-px bg-gray-200 my-4"></div>
                            <div className="prose prose-sm prose-indigo text-gray-700" dangerouslySetInnerHTML={{ __html: result }} />
                        </div>
                    </div>
                </div>
            );
        }

        // Default / Ad Copy View
        return (
            <div className="prose prose-indigo max-w-none">
                <div
                    className="whitespace-pre-wrap text-gray-700 leading-relaxed text-base"
                    dangerouslySetInnerHTML={{ __html: result }}
                />
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Input Form */}
            <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                            <Wand2 className="w-5 h-5 text-indigo-600" />
                            Product Details
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Image (Optional)
                            </label>

                            {!imagePreview ? (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer group flex flex-col items-center justify-center text-center"
                                >
                                    <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                        <Upload className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">Click to upload image</p>
                                    <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                                </div>
                            ) : (
                                <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
                                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>

                        {/* Product Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product Name
                            </label>
                            <input
                                type="text"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder="e.g. Wireless Noise-Canceling Headphones"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                        </div>

                        {/* Keywords Field [NEW] */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Keywords <span className="text-gray-400 font-normal">(Comma separated)</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={keywords}
                                    onChange={(e) => setKeywords(e.target.value)}
                                    placeholder="bluetooth, long battery, premium sound"
                                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                />
                                <Hash className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                            </div>
                        </div>

                        {/* Features & Keywords */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Key Features
                                </label>
                                <textarea
                                    value={features}
                                    onChange={(e) => setFeatures(e.target.value)}
                                    placeholder="40hr battery, active noise cancelling..."
                                    rows={3}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Target Audience
                                </label>
                                <textarea
                                    value={audience}
                                    onChange={(e) => setAudience(e.target.value)}
                                    placeholder="Frequent travelers, audiophiles..."
                                    rows={3}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                                />
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                                <div className="relative">
                                    <select
                                        value={platform}
                                        onChange={(e) => setPlatform(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                                    >
                                        <option value="ecommerce">Ecommerce (Amazon/Shopify)</option>
                                        <option value="social">Social Media (FB/Insta)</option>
                                        <option value="ad">Ad Copy</option>
                                        <option value="email">Email Marketing</option>
                                    </select>
                                    <ShoppingBag className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
                                <div className="relative">
                                    <select
                                        value={tone}
                                        onChange={(e) => setTone(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
                                    >
                                        <option value="professional">Professional</option>
                                        <option value="respectful_aspirational">Respectful & Aspirational</option>
                                        <option value="casual">Casual & Friendly</option>
                                        <option value="luxury">Luxury & Elegant</option>
                                        <option value="witty">Witty & Fun</option>
                                        <option value="urgent">Urgent (Sales)</option>
                                    </select>
                                    <MessageSquare className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                                </div>
                            </div>
                        </div>

                        {/* Length [NEW] */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Copy Length</label>
                            <div className="flex gap-2 p-1 bg-gray-50 rounded-lg border border-gray-200">
                                {['short', 'medium', 'long'].map((len) => (
                                    <button
                                        key={len}
                                        type="button"
                                        onClick={() => setCopyLength(len)}
                                        className={`flex-1 py-1.5 text-sm font-medium rounded-md capitalize transition-all ${copyLength === len
                                            ? 'bg-white text-indigo-600 shadow-sm border border-gray-100'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {len}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform active:scale-95"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    Generating Magic...
                                </>
                            ) : (
                                <>
                                    Generate Copy <Wand2 className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Right Column: Result & History */}
            <div className="lg:col-span-7 space-y-6">
                {/* Result Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden min-h-[500px] flex flex-col">
                    <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                            <span className="text-xl">✨</span> Result
                        </h2>
                        {result && (
                            <button
                                onClick={handleCopy}
                                className="text-sm flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Copied!' : 'Copy Text'}
                            </button>
                        )}
                    </div>

                    <div className="p-6 flex-grow">
                        {isLoading ? (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4 min-h-[300px]">
                                <div className="relative w-20 h-20">
                                    <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-100 rounded-full"></div>
                                    <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-800 font-medium text-lg">Analyzing your product...</p>
                                    <p className="text-sm text-gray-500 mt-1">Crafting the perfect sales angle</p>
                                </div>
                            </div>
                        ) : result ? (
                            <div className="animate-fadeIn">
                                {renderPreview()}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 min-h-[300px] border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                                <Wand2 className="w-12 h-12 text-gray-300 mb-3" />
                                <p>Your generated copy will appear here</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* History Section (Collapsible or List) */}
                {history.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                            Recent Generations
                        </h3>
                        <div className="space-y-3">
                            {history.slice(0, 3).map((item) => (
                                <div key={item.id} className="p-4 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer group" onClick={() => setResult(item.generated)}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-medium text-gray-900 line-clamp-1 group-hover:text-indigo-700">{item.productName || 'Untitled Product'}</h4>
                                        <span className="text-xs text-gray-400">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">{item.generated}</p>
                                    <div className="flex gap-2">
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 capitalize">
                                            {item.platform}
                                        </span>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 capitalize">
                                            {item.tone}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
