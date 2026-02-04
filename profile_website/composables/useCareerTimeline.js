// Parse experience data from markdown content into timeline format
export const useCareerTimeline = () => {
  const parseExperienceToTimeline = (experienceContent) => {
    if (!experienceContent) return []
    
    // If it's a markdown string, parse it directly
    if (typeof experienceContent === 'string') {
      return parseMarkdownString(experienceContent)
    }
    
    // If it's a parsed content object with body structure
    if (experienceContent.body) {
      const text = extractTextFromBody(experienceContent.body)
      return parseMarkdownString(text)
    }
    
    return []
  }
  
  const extractTextFromBody = (body) => {
    if (!body || !body.children) return ''
    
    let text = ''
    body.children.forEach(child => {
      if (child.type === 'text') {
        text += child.value + '\n'
      } else if (child.type === 'element') {
        // Handle headings
        if (child.tag === 'h3' || child.tag === 'h4') {
          text += extractTextFromElement(child) + '\n'
        }
        // Handle lists and paragraphs
        else if (child.tag === 'ul' || child.tag === 'p') {
          text += extractTextFromElement(child) + '\n'
        }
        // Handle strong/bold text
        else if (child.tag === 'strong') {
          text += '**' + extractTextFromElement(child) + '**\n'
        }
      }
    })
    
    return text
  }
  
  const extractTextFromElement = (element) => {
    if (element.type === 'text') {
      return element.value || ''
    }
    
    if (element.children) {
      return element.children.map(child => {
        if (child.type === 'text') {
          return child.value || ''
        } else if (child.type === 'element') {
          if (child.tag === 'strong') {
            return '**' + extractTextFromElement(child) + '**'
          } else if (child.tag === 'em') {
            return '*' + extractTextFromElement(child) + '*'
          }
          return extractTextFromElement(child)
        }
        return ''
      }).join('')
    }
    
    return ''
  }
  
  const parseMarkdownString = (markdown) => {
    const timeline = []
    const lines = markdown.split('\n')
    
    let currentCompany = ''
    let currentLocation = ''
    let currentRole = ''
    let currentPeriod = ''
    let keyPoints = []
    let currentSection = ''
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      // Skip empty lines and headers
      if (!line || line === '# Experience' || line === '## Employment History') continue
      
      // Parse company and location
      if (line.startsWith('### ') && line.includes(' — ')) {
        // Save previous role if exists (even without key points)
        if (currentRole) {
          timeline.push(createTimelineItem(currentCompany, currentRole, currentLocation, currentPeriod, keyPoints))
        }
        
        const companyParts = line.replace('### ', '').split(' — ')
        currentCompany = companyParts[0]
        currentLocation = companyParts[1] || ''
        currentRole = ''
        currentPeriod = ''
        keyPoints = []
        currentSection = ''
      }
      
      // Parse role and period
      else if (line.startsWith('#### ') && line.includes(' — ')) {
        // Save previous role if exists (even without key points)
        if (currentRole) {
          timeline.push(createTimelineItem(currentCompany, currentRole, currentLocation, currentPeriod, keyPoints))
        }
        
        const roleParts = line.replace('#### ', '').split(' — ')
        currentRole = roleParts[0]
        currentPeriod = roleParts[1] || ''
        keyPoints = []
        currentSection = ''
      }
      
      // Parse section headers (like "**Strategic Leadership & Practice Growth**")
      else if (line.startsWith('**') && line.endsWith('**') && !line.includes('-')) {
        currentSection = line.replace(/\*\*/g, '')
      }
      
      // Parse key points (bullet points)
      else if (line.startsWith('- ')) {
        let point = line.replace('- ', '').trim()
        
        // Add section context if available and not already in point
        if (currentSection && !point.includes(currentSection)) {
          point = `<strong class="text-accent">${currentSection}:</strong> ${point}`
        }
        
        // Extract and clean metrics/achievements - preserve HTML formatting
        point = point.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>')
        point = point.replace(/\*(.*?)\*/g, '<em class="text-accent">$1</em>')
        
        // Only add if not empty
        if (point.trim()) {
          keyPoints.push(point)
        }
      }
      // Handle non-bullet point content that might be part of a role description
      else if (currentRole && line && !line.startsWith('#') && !line.startsWith('**')) {
        // This might be a description line without bullet point
        let point = line.trim()
        if (point && !point.startsWith('-')) {
          point = point.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>')
          point = point.replace(/\*(.*?)\*/g, '<em class="text-accent">$1</em>')
          if (point.trim() && !keyPoints.includes(point)) {
            keyPoints.push(point)
          }
        }
      }
    }
    
    // Add the last role (even without key points)
    if (currentRole) {
      timeline.push(createTimelineItem(currentCompany, currentRole, currentLocation, currentPeriod, keyPoints))
    }
    
    return timeline.reverse() // Show most recent first
  }
  
  const createTimelineItem = (company, role, location, period, keyPoints) => {
    const careerLevel = determineCareerLevel(role)
    
    return {
      title: company,
      role: role,
      location: location,
      period: period,
      keyPoints: keyPoints.length > 0 ? keyPoints.slice(0, 4) : ['Role responsibilities and achievements'], // Limit to top 4 points for display
      current: period.includes('Present'),
      duration: period.includes('Present') ? calculateDuration(period) : calculateDurationFromPeriod(period),
      tags: extractTags(keyPoints),
      year: extractYear(period),
      careerLevel: careerLevel.level,
      careerLevelNumber: careerLevel.number,
      isPromotion: false // Will be set during processing
    }
  }
  
  const determineCareerLevel = (role) => {
    const roleLower = role.toLowerCase()
    
    // Career progression levels (higher number = more senior)
    if (roleLower.includes('director') || roleLower.includes('vp') || roleLower.includes('vice president')) {
      return { level: 'Executive', number: 6 }
    }
    if (roleLower.includes('manager') && (roleLower.includes('development') || roleLower.includes('team') || roleLower.includes('practice'))) {
      return { level: 'Senior Management', number: 5 }
    }
    if (roleLower.includes('lead') || roleLower.includes('practice area')) {
      return { level: 'Leadership', number: 4 }
    }
    if (roleLower.includes('architect') || roleLower.includes('consultant')) {
      return { level: 'Senior Professional', number: 3 }
    }
    if (roleLower.includes('senior') || roleLower.includes('sr.')) {
      return { level: 'Senior', number: 2 }
    }
    return { level: 'Professional', number: 1 }
  }
  
  const calculateDurationFromPeriod = (period) => {
    if (!period || period.includes('Present')) return ''
    
    // Match patterns like "Jan 2013–Jul 2016" or "Jul 2010–Dec 2012"
    const match = period.match(/(\w+)\s+(\d{4})\s*[–-]\s*(\w+)\s+(\d{4})/)
    if (!match) return ''
    
    const startMonth = match[1]
    const startYear = parseInt(match[2])
    const endMonth = match[3]
    const endYear = parseInt(match[4])
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const startMonthIndex = monthNames.indexOf(startMonth)
    const endMonthIndex = monthNames.indexOf(endMonth)
    
    if (startMonthIndex === -1 || endMonthIndex === -1) return ''
    
    let totalMonths = (endYear - startYear) * 12 + (endMonthIndex - startMonthIndex)
    const years = Math.floor(totalMonths / 12)
    const months = totalMonths % 12
    
    if (years === 0) {
      return `${months} months`
    } else if (months === 0) {
      return `${years} year${years > 1 ? 's' : ''}`
    } else {
      return `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`
    }
  }
  
  const calculateDuration = (period) => {
    if (!period.includes('Present')) return ''
    
    const startMatch = period.match(/(\w+)\s+(\d{4})/)
    if (!startMatch) return ''
    
    const startMonth = startMatch[1]
    const startYear = parseInt(startMatch[2])
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const startMonthIndex = monthNames.indexOf(startMonth)
    
    if (startMonthIndex === -1) return ''
    
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth()
    
    let totalMonths = (currentYear - startYear) * 12 + (currentMonth - startMonthIndex)
    const years = Math.floor(totalMonths / 12)
    const months = totalMonths % 12
    
    if (years === 0) {
      return `${months} months`
    } else if (months === 0) {
      return `${years} years`
    } else {
      return `${years} years ${months} months`
    }
  }
  
  const extractTags = (keyPoints) => {
    const tags = new Set()
    const tagKeywords = {
      AI: ['ai', 'artificial intelligence', 'machine learning'],
      Leadership: ['team', 'lead', 'manage', 'mentor', 'interview'],
      Architecture: ['architecture', 'design', 'solution', 'enterprise'],
      Salesforce: ['salesforce', 'force.com', 'lightning', 'cloud'],
      Innovation: ['innovation', 'pioneer', 'framework', 'toolkit'],
      Growth: ['scale', 'grow', 'build', 'expand'],
      Delivery: ['delivery', 'project', 'implementation', 'deploy']
    }
    
    keyPoints.forEach(point => {
      const lowerPoint = point.toLowerCase()
      Object.entries(tagKeywords).forEach(([tag, keywords]) => {
        if (keywords.some(keyword => lowerPoint.includes(keyword))) {
          tags.add(tag)
        }
      })
    })
    
    return Array.from(tags)
  }
  
  const extractYear = (period) => {
    if (!period) return ''
    const match = period.match(/\d{4}/)
    return match ? match[0] : ''
  }
  
  return {
    parseExperienceToTimeline
  }
}