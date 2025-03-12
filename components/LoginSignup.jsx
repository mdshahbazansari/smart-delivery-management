'use client'
import React, { useState } from 'react'
import { Input, Button, Card, message, Spin } from 'antd'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  })
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post(
        isLogin ? '/api/auth/login' : '/api/auth/signup',
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      )

      localStorage.setItem('authToken', data.token)
      message.success(isLogin ? 'Login successful!' : 'Signup successful!')
      router.push('/admin')
    } catch (error) {
      message.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <Card className='w-96 p-6 shadow-lg rounded-lg'>
        <div className='space-y-4'>
          <h1 className='text-2xl font-semibold mb-4 text-center'>
            {isLogin ? 'Login' : 'Signup'}
          </h1>
          <div>
            {!isLogin && (
              <Input
                placeholder='Name'
                name='name'
                onChange={handleChange}
                style={{ marginBottom: '12px' }} // Added spacing
              />
            )}
            <Input
              placeholder='Email'
              name='email'
              onChange={handleChange}
              style={{ marginBottom: '12px' }} // Added spacing
            />
            <Input.Password
              placeholder='Password'
              name='password'
              onChange={handleChange}
              style={{ marginBottom: '12px' }} // Added spacing
            />
          </div>
          <Button
            type='primary'
            block
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <Spin /> : isLogin ? 'Login' : 'Signup'}
          </Button>
          <p className='text-center mt-3'>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <span
              className='text-blue-500 cursor-pointer'
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? ' Signup' : ' Login'}
            </span>
          </p>
        </div>
      </Card>
    </div>
  )
}

export default LoginSignup
