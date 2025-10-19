import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Row, Col, Alert, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const slides = [
        {
            image: "/hr.png",
            title: "Onboarding New Talent with Digital HRMS",
            description: "Everything you need in an easily customizable dashboard"
        },
        {
            image: "/hr_1.png",
            title: "Streamline Employee Management",
            description: "Manage your workforce efficiently with powerful tools"
        },
        {
            image: "/hr_1 (2).png",
            title: "Advanced HR Analytics & Reporting",
            description: "Make data-driven decisions with real-time insights"
        }
    ];

    // Auto-slide effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4000); // Change slide every 4 seconds

        return () => clearInterval(interval);
    }, [slides.length]);

    const onFinish = async (values) => {
        console.log('Login attempt with:', values.email);
        setLoading(true);
        setError('');
        
        try {
            const data = await login(values.email, values.password);
            console.log('Login response:', data);
            
            if (data.success) {
                setUser(data.user);
                message.success('Login successful!');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 500);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message || 
                                error.message || 
                                'Unable to connect to server. Please check if the backend is running.';
            setError(errorMessage);
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <Row className="login-container" style={{ minHeight: '100vh', margin: 0 }}>
                <Col xs={24} md={12} className="login-left-section" style={{
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '60px 40px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ 
                        textAlign: 'center', 
                        maxWidth: '550px',
                        position: 'relative',
                        width: '100%'
                    }}>
                        {/* Slides Container */}
                        <div style={{ 
                            position: 'relative', 
                            width: '100%',
                            minHeight: '520px'
                        }}>
                            {slides.map((slide, index) => (
                                <div
                                    key={index}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        opacity: currentSlide === index ? 1 : 0,
                                        transition: 'opacity 0.8s ease-in-out',
                                        pointerEvents: currentSlide === index ? 'auto' : 'none'
                                    }}
                                >
                                    {/* Illustration Image */}
                                    <div style={{
                                        width: '100%',
                                        maxWidth: '450px',
                                        margin: '0 auto 50px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <img 
                                            src={slide.image}
                                            alt={slide.title}
                                            style={{ 
                                                width: '100%',
                                                height: 'auto',
                                                maxHeight: '350px',
                                                objectFit: 'contain'
                                            }}
                                        />
                                    </div>
                                    
                                    {/* Title */}
                                    <h1 style={{ 
                                        fontSize: '26px', 
                                        fontWeight: '700', 
                                        marginBottom: '16px',
                                        color: '#1a1a1a',
                                        lineHeight: '1.4',
                                        padding: '0 20px'
                                    }}>
                                        {slide.title}
                                    </h1>
                                    
                                    {/* Description */}
                                    <p style={{ 
                                        fontSize: '15px', 
                                        color: '#666',
                                        marginBottom: '0',
                                        lineHeight: '1.6',
                                        padding: '0 20px'
                                    }}>
                                        {slide.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Dots */}
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            gap: '8px',
                            marginTop: '40px'
                        }}>
                            {slides.map((_, index) => (
                                <span
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    style={{
                                        width: currentSlide === index ? '32px' : '8px',
                                        height: '8px',
                                        backgroundColor: currentSlide === index ? '#ff6b35' : '#d0d0d0',
                                        borderRadius: currentSlide === index ? '4px' : '50%',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                ></span>
                            ))}
                        </div>
                    </div>
                </Col>

                <Col xs={24} md={12} className="login-right-section" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '40px',
                    backgroundColor: '#fff'
                }}>
                    <div style={{ width: '100%', maxWidth: '400px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                            {/* Sagous Logo */}
                            <div style={{ 
                                display: 'inline-block',
                                marginBottom: '24px'
                            }}>
                                <img 
                                    src="https://1jro5ckmdxgkd.cdn.shift8web.com/wp-content/uploads/2022/07/cropped-sagous-logo-1-1.png"
                                    alt="Sagous Logo"
                                    style={{
                                        height: '60px',
                                        width: 'auto',
                                        objectFit: 'contain'
                                    }}
                                />
                            </div>
                            <h2 style={{ 
                                fontSize: '28px', 
                                fontWeight: 'bold',
                                marginBottom: '8px',
                                color: '#1a1a1a'
                            }}>
                                Welcome Back !
                            </h2>
                            <p style={{ 
                                color: '#999',
                                fontSize: '14px'
                            }}>
                                Please enter your details
                            </p>
                        </div>

                        {error && (
                            <Alert
                                message="Login Failed"
                                description={error}
                                type="error"
                                closable
                                onClose={() => setError('')}
                                style={{ marginBottom: 20 }}
                            />
                        )}
                        
                        <Form
                            name="login"
                            onFinish={onFinish}
                            layout="vertical"
                            size="large"
                        >
                            <Form.Item
                                label="Email Address"
                                name="email"
                                rules={[
                                    { required: true, message: 'Please input your email!' },
                                    { type: 'email', message: 'Please enter a valid email!' }
                                ]}
                            >
                                <Input 
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    style={{ borderRadius: '6px' }}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    style={{ borderRadius: '6px' }}
                                />
                            </Form.Item>

                            <Form.Item style={{ marginBottom: '16px' }}>
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center' 
                                }}>
                                    <Checkbox>Remember me</Checkbox>
                                    <a href="#" style={{ color: '#999' }}>Forgot Password?</a>
                                </div>
                            </Form.Item>

                            <Form.Item>
                                <Button 
                                    type="primary" 
                                    htmlType="submit" 
                                    loading={loading}
                                    block
                                    style={{
                                        backgroundColor: '#1a1a1a',
                                        borderColor: '#1a1a1a',
                                        borderRadius: '6px',
                                        height: '45px',
                                        fontSize: '16px'
                                    }}
                                >
                                    Login →
                                </Button>
                            </Form.Item>
                            
                            <div style={{ 
                                textAlign: 'center', 
                                color: '#666', 
                                fontSize: '13px',
                                marginTop: '20px'
                            }}>
                                <p style={{ marginBottom: '4px' }}>
                                    By creating an account, you agree to our{' '}
                                    <a href="#" style={{ color: '#1890ff' }}>Terms of Service</a> and{' '}
                                    <a href="#" style={{ color: '#1890ff' }}>Privacy Policy</a>
                                </p>
                                <p style={{ marginTop: '20px' }}>
                                    Don't have an account? <a href="#" style={{ color: '#1890ff' }}>Sign Up</a>
                                </p>
                            </div>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Login;
