# Judge0 API Server Dockerfile for Render
# Based on official Judge0 CE image

FROM judge0/judge0:1.13.1

# Set environment variables
ENV RAILS_ENV=production
ENV RAILS_LOG_TO_STDOUT=true

# Expose the API port
EXPOSE 2358

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:2358/health || exit 1

# Start the API server
CMD ["./scripts/server"]
