# Draggable Chips with Floating Animation

## Overview
This document describes the implementation of draggable, floating chips that combine CSS animations with Framer Motion drag functionality without conflicts.

## The Problem
When combining Framer Motion's `drag` functionality with continuous animations (like floating), there's a common conflict:
- Framer Motion's `animate` prop with `y: [0, -3, 0]` creates a continuous loop
- This conflicts with drag positioning, especially on the first drag
- The Y position would sometimes reset immediately while X animates back smoothly

## The Solution
Use **CSS animations for floating** instead of Framer Motion's `animate` prop. This completely separates the floating effect from the drag system.

## Implementation Details

### 1. CSS Keyframe Animation
Define a CSS keyframe animation for the floating effect:

```css
@keyframes float {
  0%, 100% { translate: 0 0px; }
  50% { translate: 0 -3px; }
}
```

**Key Points:**
- Use `translate` property (not `transform: translateY()`)
- This is crucial because Framer Motion's drag uses `transform`
- `translate` is a separate CSS property that doesn't conflict

### 2. Apply CSS Animation via Inline Styles
Apply the animation using inline styles on the motion.div:

```tsx
<motion.div
  style={{
    rotate: `${(index % 2 === 0 ? -1 : 1) * (0.5 + (index % 5) * 0.2)}deg`,
    animation: `float ${3 + (index % 3) * 0.5}s ease-in-out ${index * 0.2}s infinite`,
  }}
  // ... other props
>
```

**Animation Parameters:**
- **Duration**: `3 + (index % 3) * 0.5` seconds (varies 3-4.5s per chip)
- **Easing**: `ease-in-out` for smooth motion
- **Delay**: `index * 0.2` seconds (staggers start times)
- **Iteration**: `infinite` for continuous loop

### 3. Framer Motion Drag Configuration
Configure drag with these specific settings:

```tsx
<motion.div
  drag
  dragSnapToOrigin
  dragElastic={0.1}
  dragMomentum={false}
  dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
  whileHover={{ cursor: "grab", zIndex: 50 }}
  whileTap={{ cursor: "grabbing", zIndex: 50 }}
>
```

**Drag Settings Explained:**
- `drag`: Enables dragging in all directions
- `dragSnapToOrigin`: Chip returns to original position on release
- `dragElastic={0.1}`: Slight resistance feel (lower = more resistance)
- `dragMomentum={false}`: Prevents momentum/velocity calculations
- `dragTransition`: Controls snap-back animation
  - `bounceStiffness: 300`: How springy the return is
  - `bounceDamping: 20`: How much oscillation (higher = smoother)

### 4. Static Random Tilt
Add subtle random rotation for organic feel:

```tsx
style={{
  rotate: `${(index % 2 === 0 ? -1 : 1) * (0.5 + (index % 5) * 0.2)}deg`,
}}
```

**Tilt Calculation:**
- Alternates direction based on even/odd index
- Range: approximately -0.5° to -1.3° or 0.5° to 1.3°
- Creates variety without being too noticeable

### 5. Prevent Text Selection During Drag
Add these classes to prevent UI issues:

```tsx
className="select-none" // On container
```

And on icon/image elements:
```tsx
className="pointer-events-none select-none"
draggable="false"
```

## Complete Example

```tsx
<motion.div
  key={item.name}
  initial={{ opacity: 0, scale: 0.8 }}
  whileInView={{ opacity: 1, scale: 1 }}
  viewport={{ once: true }}
  transition={{ delay: index * 0.03, type: "spring", stiffness: 200, damping: 15 }}
  
  style={{
    rotate: `${(index % 2 === 0 ? -1 : 1) * (0.5 + (index % 5) * 0.2)}deg`,
    animation: `float ${3 + (index % 3) * 0.5}s ease-in-out ${index * 0.2}s infinite`,
  }}
  
  drag
  dragSnapToOrigin
  dragElastic={0.1}
  dragMomentum={false}
  dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
  whileHover={{ cursor: "grab", zIndex: 50 }}
  whileTap={{ cursor: "grabbing", zIndex: 50 }}
  
  className="group relative select-none"
>
  {/* Chip content */}
</motion.div>
```

## Why This Works

1. **Separation of Concerns**:
   - CSS handles the floating animation
   - Framer Motion handles drag interactions
   - No overlap in what controls the Y position

2. **CSS `translate` vs `transform`**:
   - Modern CSS `translate` property is independent
   - Framer Motion's drag uses `transform`
   - They don't conflict with each other

3. **No State Management Needed**:
   - Previous attempts used state to pause animations during drag
   - This approach requires no state tracking
   - Simpler and more performant

## Common Pitfalls to Avoid

❌ **Don't use Framer Motion's `animate` for continuous Y movement**
```tsx
// This will conflict with drag!
animate={{ y: [0, -3, 0] }}
```

❌ **Don't use `transform: translateY()` in CSS**
```css
/* This will conflict with drag! */
@keyframes float {
  50% { transform: translateY(-3px); }
}
```

❌ **Don't try to pause CSS animation with state**
```tsx
// Unnecessary complexity!
animation: isDragging ? 'none' : 'float 3s infinite'
```

✅ **Do use CSS `translate` property**
```css
@keyframes float {
  50% { translate: 0 -3px; }
}
```

## Browser Compatibility
The `translate` CSS property is supported in:
- Chrome 104+
- Firefox 72+
- Safari 14.1+

For older browsers, consider a fallback or use `transform: translateY()` with adjusted drag configuration.

## Performance Notes
- CSS animations are GPU-accelerated
- More performant than JavaScript-based animations
- No re-renders needed for the floating effect
- Drag interactions remain smooth even with many chips

## Customization Tips

**Adjust float height:**
```css
50% { translate: 0 -5px; } /* Increase from -3px */
```

**Change float speed:**
```tsx
animation: `float 2s ease-in-out infinite` /* Faster */
```

**Modify drag feel:**
```tsx
dragElastic={0.2} // More elastic
dragTransition={{ bounceStiffness: 400, bounceDamping: 15 }} // Bouncier
```

## Related Files
- Implementation: `app/toolbox/page.tsx`
- CSS animations: `app/globals.css` (if you move the keyframes there)
