package caching

type CachingService interface {
	Get(key string) (interface{}, bool)
	Invalidate(key string)
	Update(key string, data interface{})
}

// var cachingService *InMemCachingService

// func GetCachingService() CachingService {
// 	if cachingService == nil {
// 		cachingService :=
// 	}
// }

// type InMemCachingService struct {
// 	cache *cache.Cache
// }

// func (s *InMemCachingService) get(key string) (interface{}, bool) {
// 	return s.cache.Get(key)
// }
// func (s *InMemCachingService) invalidate(key string) {
// 	s.cache.Delete(key)
// }
