import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Send, MapPin, Truck, CheckCircle, User, Phone,
    Home, Navigation, ShieldCheck, AlertCircle
} from 'lucide-react';

const OrderForm = ({ isOpen, onClose, cart, total, onOrderComplete }) => {

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: '',
        pincode: '',
        location: 'tamilnadu',
        landmark: '',
        instructions: ''
    });
    const [focusedField, setFocusedField] = useState(null);
    const [status, setStatus] = useState('idle');

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.top = `-${window.scrollY}px`;
        } else {
            const scrollY = document.body.style.top;
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.top = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            document.body.style.top = '';
        };
    }, [isOpen]);

    const deliveryCharge = formData.location === 'tamilnadu' ? 50 : 80;
    const subtotal = total;
    const isFreeDelivery = subtotal >= 1000;
    const grandTotal = isFreeDelivery ? subtotal : subtotal + deliveryCharge;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handlePincodeChange = (e) => {
        const pincode = e.target.value;
        setFormData({ ...formData, pincode });

        if (pincode.length === 6) {
            const firstDigit = pincode.charAt(0);
            if (firstDigit === '6') {
                setFormData(prev => ({ ...prev, location: 'tamilnadu' }));
            } else {
                setFormData(prev => ({ ...prev, location: 'outside' }));
            }
        }
    };

    const generateWhatsAppMessage = () => {

        const orderDate = new Date().toLocaleString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        let message = "TRENDY MOD TOYS - NEW ORDER\n\n";
        message += "*ORDER DATE :* " + orderDate + "\n\n";

        message += "===============================\n";
        message += "*CUSTOMER DETAILS*\n";
        message += "===============================\n";

        // Use dashes/bullets instead of trying to align with spaces
        message += "• Name      : " + formData.name + "\n";
        message += "• Phone     : " + formData.phone + "\n";
        message += "• Address   : " + formData.address + "\n";
        message += "• Landmark  : " + (formData.landmark || "N/A") + "\n";
        message += "• Pincode   : " + formData.pincode + "\n";
        message += "• Region    : " +
            (formData.location === "tamilnadu" ? "Tamil Nadu" : "Outside Tamil Nadu") + "\n\n";

        message += "===============================\n";
        message += "*ORDER ITEMS*\n";
        message += "===============================\n";

        cart.forEach((item, idx) => {
            message += `${idx + 1}. ${item.name}\n`;
            message += `   • Qty    : ${item.quantity}\n`;
            message += `   • Price  : ₹${item.price}\n`;
            message += `   • Total  : ₹${item.price * item.quantity}\n\n`;
        });

        message += "===============================\n";
        message += "*ORDER SUMMARY*\n";
        message += "===============================\n";
        message += "• Total Items  : " + totalItems + "\n";
        message += "• Sub Total    : ₹" + subtotal + "\n";
        message += "• Delivery Fee : " + (isFreeDelivery ? "FREE" : "₹" + deliveryCharge) + "\n";
        message += "• Grand Total  : ₹" + grandTotal + "\n\n";

        message += "===============================\n";
        message += "Thank you for shopping with TrendyMod Toys.\n";
        message += "We will contact you shortly to confirm your order.";

        return encodeURIComponent(message);
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.name.trim()) return alert("Please enter your full name");
        if (!formData.address.trim()) return alert("Please enter your delivery address");
        if (!formData.phone.trim()) return alert("Please enter your phone number");
        if (!/^\d{10}$/.test(formData.phone.trim())) return alert("Please enter a valid 10-digit phone number");
        if (!/^\d{6}$/.test(formData.pincode.trim())) return alert("Please enter a valid 6-digit pincode");

        setStatus('sending');
        await new Promise(resolve => setTimeout(resolve, 500));
        const message = generateWhatsAppMessage();
        const whatsappUrl = `https://wa.me/916381374203?text=${message}`;

        window.open(whatsappUrl, '_blank');
        setStatus('sent');

        setTimeout(() => {
            setFormData({
                name: '', address: '', phone: '', pincode: '',
                location: 'tamilnadu', landmark: '', instructions: ''
            });
            setStatus('idle');
            onOrderComplete();
            onClose();
        }, 2000);
    };

    const requiredFields = ['name', 'address', 'phone', 'pincode'];
    const isFieldRequired = (fieldName) => requiredFields.includes(fieldName);

    const inputFields = [
        { name: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'Enter your full name' },
        { name: 'phone', label: 'Phone Number', icon: Phone, type: 'tel', placeholder: '6381374203', maxLength: 10 },
        { name: 'pincode', label: 'Pincode', icon: Navigation, type: 'text', placeholder: '600001', maxLength: 6 },
        { name: 'address', label: 'Delivery Address', icon: Home, type: 'text', placeholder: 'House No., Street name, Area, City' },
        { name: 'landmark', label: 'Landmark (Optional)', icon: MapPin, type: 'text', placeholder: 'Nearby school, shop or landmark' },
        { name: 'instructions', label: 'Delivery Instructions (Optional)', icon: AlertCircle, type: 'text', placeholder: 'Leave with neighbor, call before delivery, etc.' }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-50 transition-opacity"
                    />

                    {/* Main Sidebar Panel Container - Fully scrollable */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-white shadow-2xl z-50 overflow-y-auto border-l border-slate-100"
                        style={{ overscrollBehavior: 'contain' }}
                    >
                        {/* Header - Part of scroll flow */}
                        <div className="p-4 sm:p-5 border-b border-slate-100 bg-white flex items-center justify-between">
                            <div className="min-w-0 pr-2">
                                <div className="flex items-center gap-2">
                                    <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">Shipping Info</h2>
                                </div>
                                <p className="text-[11px] sm:text-xs text-slate-500 mt-1 font-medium truncate">
                                    Complete details to finalize your WhatsApp dispatch
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all shrink-0"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Main Content - No fixed height, flows naturally */}
                        <div className="bg-white">
                            {status === 'sent' ? (
                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center text-center px-4 py-20">
                                    <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 mb-3 text-emerald-500">
                                        <CheckCircle size={24} />
                                    </div>
                                    <h3 className="text-sm sm:text-base font-bold text-slate-900">Order Dispatched! 🎉</h3>
                                    <p className="text-xs text-slate-400 max-w-60 mt-1">
                                        WhatsApp application has successfully generated your order request link.
                                    </p>
                                </motion.div>
                            ) : status === 'sending' ? (
                                <div className="flex flex-col items-center justify-center text-center py-20">
                                    <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                                    <p className="text-xs text-slate-500 font-medium">Connecting to secure fulfillment gateway...</p>
                                </div>
                            ) : (
                                <form id="order-form" onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
                                    {/* Logistics Dynamic Banner */}
                                    <div className="bg-blue-50/40 border border-blue-100/60 rounded-xl p-3 flex items-start gap-2.5">
                                        <Truck size={15} className="text-blue-600 mt-0.5 shrink-0" />
                                        <div className="text-[11px] sm:text-xs">
                                            <p className="font-bold text-slate-800">Fulfillment Verification</p>
                                            <p className="text-slate-500 mt-0.5 font-medium">
                                                Standard shipping metrics apply to this package destination.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Form Fields Stack */}
                                    <div className="space-y-3.5">
                                        {inputFields.map((field) => (
                                            <div key={field.name} className="space-y-2">
                                                <label className="block text-xs font-bold text-slate-700 ml-0.5">
                                                    {field.label}
                                                    {/* Use the helper function to determine if field is required */}
                                                    {isFieldRequired(field.name) && <span className="text-red-500"> *</span>}
                                                </label>
                                                <div className="relative flex items-center">
                                                    <div className={`absolute left-3 text-slate-400 transition-colors pointer-events-none ${focusedField === field.name ? 'text-blue-600' : ''}`}>
                                                        <field.icon size={15} />
                                                    </div>
                                                    <input
                                                        type={field.type}
                                                        name={field.name}
                                                        value={formData[field.name]}
                                                        onChange={(e) => field.name === 'pincode' ? handlePincodeChange(e) : setFormData({ ...formData, [field.name]: e.target.value })}
                                                        onFocus={() => setFocusedField(field.name)}
                                                        onBlur={() => setFocusedField(null)}
                                                        maxLength={field.maxLength}
                                                        className="w-full h-10 pl-9 pr-3 border border-slate-200 focus:border-blue-500 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all shadow-sm shadow-slate-100/50"
                                                        placeholder={field.placeholder}
                                                        // Only set required for fields that are in the requiredFields array
                                                        required={isFieldRequired(field.name)}
                                                    />
                                                </div>
                                            </div>
                                        ))}

                                        {/* Dropdown Field */}
                                        <div className="space-y-2">
                                            <label className="block text-xs font-bold text-slate-700 ml-0.5">
                                                Delivery Destination Region <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative flex items-center">
                                                <select
                                                    value={formData.location}
                                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                    className="w-full h-10 pl-9 pr-8 bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none transition-all shadow-sm shadow-slate-100/50 appearance-none cursor-pointer"
                                                >
                                                    <option value="tamilnadu">Tamil Nadu Region (Standard : ₹50)</option>
                                                    <option value="outside">Domestic - Out of Tamil Nadu (Standard : ₹80)</option>
                                                </select>
                                                <MapPin className="absolute left-3 text-slate-400 pointer-events-none" size={15} />
                                                <div className="absolute right-3 pointer-events-none text-slate-400">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Inline Footer - Part of scroll flow, not fixed */}
                                    <div className="border-t border-slate-100 pt-5 mt-6 bg-white">
                                        <div className="space-y-2 mb-4">
                                            <div className="flex justify-between text-xs font-semibold text-slate-500">
                                                <span>Items Base Subtotal</span>
                                                <span className="text-slate-900">₹{subtotal}</span>
                                            </div>
                                            <div className="flex justify-between text-xs font-semibold text-slate-500">
                                                <span>Regional Shipping Costs</span>
                                                <span className={isFreeDelivery ? "text-blue-600 font-bold" : "text-slate-900"}>
                                                    {isFreeDelivery ? "₹0" : `₹${deliveryCharge}`}
                                                </span>
                                            </div>
                                            <div className="border-t border-slate-200/60 pt-2.5 mt-1">
                                                <div className="flex justify-between items-baseline">
                                                    <span className="text-xs sm:text-sm font-bold text-slate-900">Total Invoice Due</span>
                                                    <span className="text-lg sm:text-xl font-black text-blue-600">₹{grandTotal}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Submit Action Button */}
                                        <button
                                            type="submit"
                                            form="order-form"
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-blue-600/10 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                        >
                                            Confirm & Open WhatsApp
                                            <Send size={14} className="ml-0.5" />
                                        </button>

                                        <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-slate-400 font-medium text-center mt-3 pb-4">
                                            <ShieldCheck size={12} className="text-blue-600 shrink-0" />
                                            <span className="truncate">End-to-End Encryption • Secure Order Forwarding</span>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default OrderForm;