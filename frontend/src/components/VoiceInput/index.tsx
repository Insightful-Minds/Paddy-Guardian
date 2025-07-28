import React, { useState, useRef, useCallback } from 'react';
import { Button, Alert, Spinner } from 'react-bootstrap';

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message?: string;
}

interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative;
    length: number;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    length: number;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    grammars: any;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    serviceURI: string;
    
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    
    start(): void;
    stop(): void;
    abort(): void;
}

declare var SpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
};

declare var webkitSpeechRecognition: {
    prototype: SpeechRecognition;
    new(): SpeechRecognition;
};

interface VoiceInputProps {
    onTranscript: (transcript: string) => void;
    onError?: (error: string) => void;
    language?: string;
    className?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({
    onTranscript,
    onError,
    language = 'si-LK', // Sinhala (Sri Lanka)
    className = ''
}) => {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(true);
    const [error, setError] = useState<string>('');
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    // Check for browser support
    React.useEffect(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            setIsSupported(false);
            setError('Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
        }
    }, []);

    const startListening = useCallback(() => {
        if (!isSupported) return;

        setError('');
        
        try {
            // Create speech recognition instance
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            // Configure recognition
            recognition.lang = language;
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            // Event handlers
            recognition.onstart = () => {
                setIsListening(true);
                console.log('Voice recognition started');
            };

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                const transcript = event.results[0][0].transcript;
                console.log('Voice transcript:', transcript);
                onTranscript(transcript);
                setIsListening(false);
            };

            recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error('Voice recognition error:', event.error);
                let errorMessage = 'Voice recognition error occurred.';
                
                switch (event.error) {
                    case 'network':
                        errorMessage = 'Network error. Please check your internet connection.';
                        break;
                    case 'not-allowed':
                        errorMessage = 'Microphone access denied. Please allow microphone access and try again.';
                        break;
                    case 'no-speech':
                        errorMessage = 'No speech detected. Please try speaking again.';
                        break;
                    case 'audio-capture':
                        errorMessage = 'No microphone found. Please check your microphone.';
                        break;
                    case 'language-not-supported':
                        errorMessage = 'Sinhala language is not supported by your browser for voice recognition.';
                        break;
                    default:
                        errorMessage = `Voice recognition error: ${event.error}`;
                }
                
                setError(errorMessage);
                setIsListening(false);
                onError?.(errorMessage);
            };

            recognition.onend = () => {
                setIsListening(false);
                console.log('Voice recognition ended');
            };

            // Start recognition
            recognition.start();
            recognitionRef.current = recognition;

        } catch (err) {
            console.error('Failed to start voice recognition:', err);
            setError('Failed to initialize voice recognition. Please try again.');
            setIsListening(false);
            onError?.('Failed to initialize voice recognition.');
        }
    }, [isSupported, language, onTranscript, onError]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setIsListening(false);
    }, []);

    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    if (!isSupported) {
        return (
            <Alert variant="warning" className="mb-3">
                <Alert.Heading>🎤 Voice Input Not Supported</Alert.Heading>
                <p className="mb-0">
                    Your browser doesn't support voice recognition. Please use Chrome, Edge, or Safari for voice input feature.
                    <br />
                    <small className="text-muted">
                        ඔබේ බ්‍රවුසරය හඬ හඳුනාගැනීම සඳහා සහාය නොදක්වයි. හඬ ආදාන විශේෂාංගය සඳහා Chrome, Edge, හෝ Safari භාවිතා කරන්න.
                    </small>
                </p>
            </Alert>
        );
    }

    return (
        <div className={className}>
            {error && (
                <Alert variant="danger" className="mb-3" dismissible onClose={() => setError('')}>
                    <Alert.Heading>🎤 Voice Input Error</Alert.Heading>
                    <p className="mb-0">{error}</p>
                </Alert>
            )}
            
            <div className="d-flex gap-2 align-items-center">
                <Button
                    variant={isListening ? "danger" : "primary"}
                    size="lg"
                    onClick={isListening ? stopListening : startListening}
                    disabled={!isSupported}
                    className="d-flex align-items-center gap-2"
                >
                    {isListening ? (
                        <>
                            <Spinner size="sm" animation="grow" />
                            🎤 Stop Recording
                        </>
                    ) : (
                        <>
                            🎤 Start Voice Input
                        </>
                    )}
                </Button>
                
                {isListening && (
                    <div className="text-primary d-flex align-items-center gap-2">
                        <Spinner size="sm" animation="border" />
                        <span>Listening... Speak in Sinhala</span>
                    </div>
                )}
            </div>
            
            <small className="text-muted d-block mt-2">
                🎤 සිංහල භාෂාවෙන් කතා කරන්න | Speak in Sinhala language
                <br />
                📱 මයික්‍රොෆෝන් භාවිතයට අවසරය දෙන්න | Allow microphone access when prompted
            </small>
        </div>
    );
};

// Extend the Window interface for TypeScript
declare global {
    interface Window {
        SpeechRecognition: typeof SpeechRecognition;
        webkitSpeechRecognition: typeof webkitSpeechRecognition;
    }
}

export default VoiceInput;
