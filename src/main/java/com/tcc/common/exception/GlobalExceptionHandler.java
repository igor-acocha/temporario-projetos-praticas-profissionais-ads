package com.tcc.common.exception;

import com.tcc.common.dto.ResponseErrorDto;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * Trata erros de validação dos DTOs (ex: @NotBlank, @Email).
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ResponseErrorDto> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(fieldError -> String.format("O campo '%s' %s", fieldError.getField(), fieldError.getDefaultMessage()))
                .collect(Collectors.joining("; "));

        log.warn("Erro de validação: {}", errorMessage);
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Erro de validação: " + errorMessage, request);
    }

    /**
     * Trata exceções de violação de integridade do banco de dados (ex: valor duplicado).
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ResponseErrorDto> handleDataIntegrityViolationException(DataIntegrityViolationException ex, HttpServletRequest request) {
        String rootMessage = ex.getRootCause() != null ? ex.getRootCause().getMessage() : ex.getMessage();
        String message = "Conflito de dados. Um valor já existe no banco de dados.";

        // Tenta extrair a informação de duplicidade para uma mensagem mais clara
        if (rootMessage != null && rootMessage.contains("Duplicate entry")) {
            message = "O valor fornecido já está em uso. Por favor, tente outro.";
        }

        log.error("Conflito de integridade de dados: {}", message, ex);
        return buildErrorResponse(HttpStatus.CONFLICT, message, request);
    }

    /**
     * Trata a exceção customizada para usuário não encontrado.
     */
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ResponseErrorDto> handleUserNotFoundException(UserNotFoundException ex, HttpServletRequest request) {
        log.warn("Tentativa de acesso com usuário não encontrado: {}", ex.getMessage());
        return buildErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request);
    }

    /**
     * Trata a exceção customizada para credenciais inválidas (senha errada).
     */
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ResponseErrorDto> handleInvalidCredentialsException(InvalidCredentialsException ex, HttpServletRequest request) {
        log.warn("Tentativa de login com credenciais inválidas: {}", ex.getMessage());
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, ex.getMessage(), request);
    }

    /**
     * Handler genérico para qualquer outra exceção não tratada.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseErrorDto> handleInternalErrorException(Exception ex, HttpServletRequest request) {
        log.error("Erro interno inesperado no servidor.", ex);
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Ocorreu um erro inesperado no servidor.", request);
    }

    private ResponseEntity<ResponseErrorDto> buildErrorResponse(HttpStatus status, String message, HttpServletRequest request) {
        ResponseErrorDto errorResponse = new ResponseErrorDto(
                LocalDateTime.now(),
                status.value(),
                message,
                request.getRequestURI()
        );
        return ResponseEntity.status(status).body(errorResponse);
    }
}
