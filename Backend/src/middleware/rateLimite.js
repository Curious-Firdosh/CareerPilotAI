import  rateLimit ,{ ipKeyGenerator }  from "express-rate-limit"

export const aiLimiter = rateLimit({
     windowMs: 60 * 1000, // 1 min
       max: 2,
       message: "Too many AI requests",
       keyGenerator: (req) => req.user?.id || ipKeyGenerator(req)
})

export const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: "Too many login attempts"
})


export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: "Too many accounts created"
});