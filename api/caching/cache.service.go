package caching

import (
	"time"

	"github.com/patrickmn/go-cache"
)

type CachingService interface {
	Get(key string) (interface{}, bool)
	Invalidate(key string)
	Update(key string, data interface{})
}

var cachingService *InMemCachingService

func GetCachingService() CachingService {
	if cachingService == nil {
		cachingService = new(InMemCachingService)
		c := cache.New(5*time.Minute, 10*time.Minute)
		cachingService.cache = c
	}
	return cachingService
}

type InMemCachingService struct {
	cache *cache.Cache
}

func (s *InMemCachingService) Get(key string) (interface{}, bool) {
	return s.cache.Get(key)
}

func (s *InMemCachingService) Invalidate(key string) {
	s.cache.Delete(key)
}

func (s *InMemCachingService) Update(key string, data interface{}) {
	s.cache.Set(key, data, 0)
}
